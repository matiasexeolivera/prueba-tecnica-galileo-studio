import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  await prisma.ticketEvent.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const password = await bcrypt.hash("demo1234", 10);

  // --- Galileo Studio staff ---
  const staffAdmin = await prisma.user.create({
    data: {
      email: "admin@galileostudio.ai",
      name: "Ana (Galileo Studio)",
      password,
      role: "STAFF_ADMIN",
    },
  });

  const staffAgent = await prisma.user.create({
    data: {
      email: "agente@galileostudio.ai",
      name: "Marcos (Galileo Studio)",
      password,
      role: "STAFF_AGENT",
    },
  });

  // --- Client organization 1: Acme Corp ---
  const acme = await prisma.organization.create({
    data: { name: "Acme Corp", slug: "acme-corp" },
  });

  const acmeAdmin = await prisma.user.create({
    data: {
      email: "admin@acme.test",
      name: "Laura Pérez",
      password,
      role: "CLIENT_ADMIN",
      organizationId: acme.id,
    },
  });

  const acmeMember = await prisma.user.create({
    data: {
      email: "dev@acme.test",
      name: "Jorge Ruiz",
      password,
      role: "CLIENT_MEMBER",
      organizationId: acme.id,
    },
  });

  // --- Client organization 2: Bluewave S.A. ---
  const bluewave = await prisma.organization.create({
    data: { name: "Bluewave S.A.", slug: "bluewave-sa" },
  });

  const bluewaveAdmin = await prisma.user.create({
    data: {
      email: "admin@bluewave.test",
      name: "Sofía Gómez",
      password,
      role: "CLIENT_ADMIN",
      organizationId: bluewave.id,
    },
  });

  // --- Sample tickets ---
  await prisma.ticket.create({
    data: {
      title: "El login falla intermitentemente",
      description:
        "Desde ayer, aproximadamente 1 de cada 5 intentos de login devuelve error 500.",
      type: "INCIDENT",
      priority: "URGENT",
      status: "IN_PROGRESS",
      organizationId: acme.id,
      createdById: acmeAdmin.id,
      assignedToId: staffAgent.id,
      comments: {
        create: [
          {
            body: "Hemos detectado que ocurre solo en el login con Google. Estamos revisando.",
            authorId: staffAgent.id,
          },
          {
            body: "Gracias por la actualización, quedamos atentos.",
            authorId: acmeAdmin.id,
          },
        ],
      },
      events: {
        create: [
          { type: "CREATED" },
          { type: "STATUS_CHANGED", metadata: JSON.stringify({ from: "OPEN", to: "IN_PROGRESS" }) },
        ],
      },
    },
  });

  await prisma.ticket.create({
    data: {
      title: "¿Se puede exportar el reporte mensual a Excel?",
      description: "Nos gustaría poder exportar los datos del dashboard a un .xlsx.",
      type: "QUESTION",
      priority: "LOW",
      status: "OPEN",
      organizationId: acme.id,
      createdById: acmeMember.id,
      events: { create: [{ type: "CREATED" }] },
    },
  });

  await prisma.ticket.create({
    data: {
      title: "Añadir un nuevo usuario al panel de administración",
      description: "Necesitamos dar acceso a una nueva persona de nuestro equipo.",
      type: "REQUEST",
      priority: "MEDIUM",
      status: "RESOLVED",
      organizationId: acme.id,
      createdById: acmeAdmin.id,
      assignedToId: staffAdmin.id,
      events: { create: [{ type: "CREATED" }, { type: "STATUS_CHANGED", metadata: JSON.stringify({ from: "OPEN", to: "RESOLVED" }) }] },
    },
  });

  await prisma.ticket.create({
    data: {
      title: "Integración con nuestro CRM no sincroniza",
      description: "Los contactos nuevos no se están sincronizando desde hace 3 días.",
      type: "INCIDENT",
      priority: "HIGH",
      status: "WAITING_ON_CLIENT",
      organizationId: bluewave.id,
      createdById: bluewaveAdmin.id,
      assignedToId: staffAgent.id,
      comments: {
        create: [
          {
            body: "¿Podrías confirmarnos si cambiaron las credenciales de la API del CRM recientemente?",
            authorId: staffAgent.id,
          },
        ],
      },
      events: { create: [{ type: "CREATED" }] },
    },
  });

  console.log("Seed completado.");
  console.log("");
  console.log("Usuarios de prueba (password para todos: demo1234):");
  console.log("  STAFF_ADMIN   admin@galileostudio.ai");
  console.log("  STAFF_AGENT   agente@galileostudio.ai");
  console.log("  CLIENT_ADMIN  admin@acme.test        (Acme Corp)");
  console.log("  CLIENT_MEMBER dev@acme.test           (Acme Corp)");
  console.log("  CLIENT_ADMIN  admin@bluewave.test     (Bluewave S.A.)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
