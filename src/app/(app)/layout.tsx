import Link from "next/link";
import { requireSession, isStaff } from "@/lib/authz";
import { logoutAction } from "./actions";

const ROLE_LABEL: Record<string, string> = {
  STAFF_ADMIN: "Staff · Admin",
  STAFF_AGENT: "Staff · Agente",
  CLIENT_ADMIN: "Cliente · Admin",
  CLIENT_MEMBER: "Cliente · Miembro",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const staff = isStaff(session);

  return (
    <div className="flex-1 flex min-h-screen">
      <aside className="w-64 shrink-0 border-r border-border bg-white flex flex-col">
        <div className="px-5 py-5 border-b border-border">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase">
            Galileo Studio
          </p>
          <p className="text-sm text-muted mt-0.5">Portal de clientes</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent-soft hover:text-accent transition-colors"
          >
            {staff ? "Todos los tickets" : "Mis tickets"}
          </Link>
          {!staff && (
            <Link
              href="/tickets/new"
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent-soft hover:text-accent transition-colors"
            >
              Nueva solicitud
            </Link>
          )}
        </nav>

        <div className="px-4 py-4 border-t border-border">
          <p className="text-sm font-medium truncate">{session.user.name}</p>
          <p className="text-xs text-muted mb-3">{ROLE_LABEL[session.user.role]}</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
