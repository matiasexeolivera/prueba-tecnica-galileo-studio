import Link from "next/link";
import { requireSession, isStaff } from "@/lib/authz";
import { listTicketsForSession } from "@/lib/tickets";
import { StatusBadge, PriorityBadge, TypeBadge } from "@/components/badges";

function timeAgo(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "justo ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

export default async function DashboardPage() {
  const session = await requireSession();
  const staff = isStaff(session);
  const tickets = await listTicketsForSession(session);

  return (
    <div className="px-8 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">
            {staff ? "Todos los tickets" : "Mis tickets"}
          </h1>
          <p className="text-sm text-muted mt-0.5">
            {staff
              ? "Vista consolidada de todos los clientes."
              : "Estado de tus incidencias, solicitudes y dudas."}
          </p>
        </div>
        {!staff && (
          <Link
            href="/tickets/new"
            className="rounded-lg bg-accent text-white text-sm font-medium px-4 py-2 hover:bg-accent-hover transition-colors"
          >
            + Nueva solicitud
          </Link>
        )}
      </div>

      {tickets.length === 0 ? (
        <div className="card p-10 text-center text-muted text-sm">
          No hay tickets todavía.
          {!staff && (
            <>
              {" "}
              <Link href="/tickets/new" className="text-accent font-medium">
                Crea el primero
              </Link>
              .
            </>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted uppercase tracking-wide">
                <th className="px-4 py-3 font-medium">Ticket</th>
                {staff && <th className="px-4 py-3 font-medium">Cliente</th>}
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Prioridad</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Actualizado</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-border last:border-0 hover:bg-accent-soft/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link href={`/tickets/${t.id}`} className="font-medium hover:text-accent">
                      {t.title}
                    </Link>
                    <p className="text-xs text-muted mt-0.5">
                      {t._count.comments} comentario{t._count.comments === 1 ? "" : "s"}
                    </p>
                  </td>
                  {staff && (
                    <td className="px-4 py-3 text-muted">{t.organization.name}</td>
                  )}
                  <td className="px-4 py-3">
                    <TypeBadge type={t.type} />
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">{timeAgo(t.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
