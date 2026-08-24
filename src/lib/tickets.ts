import "server-only";
import { prisma } from "@/lib/prisma";
import { isStaff, type Session } from "@/lib/authz";

// Single access point for tickets: organizationId always comes from the session, never the request.

export async function listTicketsForSession(session: Session) {
  if (isStaff(session)) {
    return prisma.ticket.findMany({
      include: {
        organization: true,
        createdBy: true,
        assignedTo: true,
        _count: { select: { comments: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  const organizationId = session.user.organizationId;
  if (!organizationId) return [];

  return prisma.ticket.findMany({
    where: { organizationId },
    include: {
      organization: true,
      createdBy: true,
      assignedTo: true,
      _count: { select: { comments: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getTicketForSession(session: Session, ticketId: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      organization: true,
      createdBy: true,
      assignedTo: true,
      comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
      events: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!ticket) return null;

  // Isolation guard: a client user can only see tickets from their own organization.
  if (!isStaff(session) && ticket.organizationId !== session.user.organizationId) {
    return null;
  }

  return ticket;
}

export async function createTicket(
  session: Session,
  input: { title: string; description: string; type: "INCIDENT" | "REQUEST" | "QUESTION"; priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" }
) {
  if (isStaff(session)) {
    throw new Error("El staff no crea tickets en nombre de un cliente en esta versión.");
  }
  const organizationId = session.user.organizationId;
  if (!organizationId) throw new Error("El usuario no pertenece a ninguna organización.");

  return prisma.ticket.create({
    data: {
      ...input,
      organizationId,
      createdById: session.user.id,
      events: { create: [{ type: "CREATED" }] },
    },
  });
}

export async function addComment(session: Session, ticketId: string, body: string) {
  const ticket = await getTicketForSession(session, ticketId);
  if (!ticket) throw new Error("Ticket no encontrado o sin permiso.");

  return prisma.comment.create({
    data: { ticketId, authorId: session.user.id, body },
  });
}

export async function updateTicketStatus(
  session: Session,
  ticketId: string,
  status: "OPEN" | "IN_PROGRESS" | "WAITING_ON_CLIENT" | "RESOLVED" | "CLOSED"
) {
  if (!isStaff(session)) {
    throw new Error("Solo el staff de la consultora puede cambiar el estado de un ticket.");
  }
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw new Error("Ticket no encontrado.");

  const [updated] = await prisma.$transaction([
    prisma.ticket.update({ where: { id: ticketId }, data: { status } }),
    prisma.ticketEvent.create({
      data: {
        ticketId,
        type: "STATUS_CHANGED",
        metadata: JSON.stringify({ from: ticket.status, to: status }),
      },
    }),
  ]);

  return updated;
}

export async function assignTicket(session: Session, ticketId: string, assignedToId: string | null) {
  if (!isStaff(session)) {
    throw new Error("Solo el staff de la consultora puede asignar tickets.");
  }
  const [updated] = await prisma.$transaction([
    prisma.ticket.update({ where: { id: ticketId }, data: { assignedToId } }),
    prisma.ticketEvent.create({
      data: { ticketId, type: "ASSIGNED", metadata: JSON.stringify({ assignedToId }) },
    }),
  ]);
  return updated;
}
