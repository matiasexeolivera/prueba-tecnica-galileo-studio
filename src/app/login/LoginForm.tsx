"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";

const DEMO_ACCOUNTS = [
  { label: "Staff (admin)", email: "admin@galileostudio.ai" },
  { label: "Staff (agente)", email: "agente@galileostudio.ai" },
  { label: "Acme Corp (admin)", email: "admin@acme.test" },
  { label: "Acme Corp (miembro)", email: "dev@acme.test" },
  { label: "Bluewave S.A. (admin)", email: "admin@bluewave.test" },
];

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, { error: null });

  return (
    <div className="w-full max-w-sm">
      <form action={formAction} className="card p-6 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue="admin@acme.test"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            defaultValue="demo1234"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {state.error && (
          <p className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] rounded-lg px-3 py-2">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-accent text-white text-sm font-medium py-2.5 hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="card mt-4 p-4 text-xs text-muted">
        <p className="font-medium text-foreground mb-2">Cuentas de demo (contraseña: demo1234)</p>
        <ul className="space-y-1">
          {DEMO_ACCOUNTS.map((acc) => (
            <li key={acc.email} className="flex justify-between gap-2">
              <span>{acc.label}</span>
              <code className="text-muted">{acc.email}</code>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
