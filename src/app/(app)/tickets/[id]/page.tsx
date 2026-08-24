import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession, isStaff } from "@/lib/authz";
import { getTicketForSession } from "@/lib/tickets";
import { StatusBadge, PriorityBadge, TypeBadge } from "@/components/badges";
import { CommentForm } from "./CommentForm";
import { StatusChanger } from "./StatusChanger";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();
  const staff = isStaff(session);
  const ticket = await getTicketForSession(session, id);

  if (!ticket) notFound();

  return (
    <div className="px-8 py-8 max-w-3xl">
      <Link href="/dashboard" className="text-sm text-muted hover:text-accent">
        ← Volver
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{ticket.title}</h1>
          <p className="text-sm text-muted mt-1">
            {staff ? `${ticket.organization.name} · ` : ""}
            Creado por {ticket.createdBy.name} el {formatDateTime(ticket.createdAt)}
          </p>
        </div>
        {staff ? (
          <StatusChanger ticketId={ticket.id} status={ticket.status} />
        ) : (
          <StatusBadge status={ticket.status} />
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <TypeBadge type={ticket.type} />
        <PriorityBadge priority={ticket.priority} />
      </div>

      <div className="card p-5 mt-6">
        <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
      </div>

      {ticket.assignedTo && (
        <p className="text-xs text-muted mt-3">
          Asignado a <span className="font-medium text-foreground">{ticket.assignedTo.name}</span>
        </p>
      )}

      <h2 className="text-sm font-semibold mt-8 mb-3">
        Conversación ({ticket.comments.length})
      </h2>

      <div className="flex flex-col gap-3 mb-5">
        {ticket.comments.map((c) => (
          <div key={c.id} className="card p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{c.author.name}</span>
              <span className="text-xs text-muted">{formatDateTime(c.createdAt)}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{c.body}</p>
          </div>
        ))}
        {ticket.comments.length === 0 && (
          <p className="text-sm text-muted">Todavía no hay comentarios.</p>
        )}
      </div>

      <CommentForm ticketId={ticket.id} />
    </div>
  );
}
