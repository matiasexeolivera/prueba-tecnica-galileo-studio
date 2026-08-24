"use client";

import { useActionState } from "react";
import { createTicketAction, type NewTicketState } from "./actions";

const initialState: NewTicketState = { error: null };

export function NewTicketForm() {
  const [state, formAction, pending] = useActionState(createTicketAction, initialState);

  return (
    <form action={formAction} className="card p-6 flex flex-col gap-5 max-w-2xl">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
          Título
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="Resumen breve del problema o petición"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-foreground mb-1">
            Tipo
          </label>
          <select
            id="type"
            name="type"
            defaultValue="REQUEST"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="INCIDENT">Incidencia (algo no funciona)</option>
            <option value="REQUEST">Solicitud (algo nuevo)</option>
            <option value="QUESTION">Duda</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-1">
            Prioridad
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue="MEDIUM"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          placeholder="Cuéntanos con el mayor detalle posible qué necesitas..."
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {state.error && (
        <p className="text-sm text-[var(--danger)] bg-[var(--danger-soft)] rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent text-white text-sm font-medium px-5 py-2.5 hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {pending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </form>
  );
}
