import Link from "next/link";
import { requireSession, isStaff } from "@/lib/authz";
import { Logomark } from "@/components/Logomark";
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
      <aside className="w-64 shrink-0 flex flex-col bg-brand-bg text-brand-fg">
        <div className="px-5 py-5 border-b border-brand-border flex items-center gap-2.5">
          <Logomark className="w-6 h-6 text-accent" />
          <div>
            <p className="text-sm font-semibold leading-tight">Galileo Studio</p>
            <p className="text-xs text-brand-fg-muted leading-tight">Portal de clientes</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-brand-fg/90 hover:bg-brand-bg-soft hover:text-white transition-colors"
          >
            {staff ? "Todos los tickets" : "Mis tickets"}
          </Link>
          {!staff && (
            <Link
              href="/tickets/new"
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-fg/90 hover:bg-brand-bg-soft hover:text-white transition-colors"
            >
              Nueva solicitud
            </Link>
          )}
        </nav>

        <div className="px-4 py-4 border-t border-brand-border">
          <p className="text-sm font-medium truncate">{session.user.name}</p>
          <p className="text-xs text-brand-fg-muted mb-3">{ROLE_LABEL[session.user.role]}</p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs text-brand-fg-muted hover:text-white transition-colors"
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
