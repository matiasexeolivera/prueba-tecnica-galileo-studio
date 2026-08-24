"use client";

import { useTransition } from "react";
import { updateStatusAction } from "./actions";

const OPTIONS = [
  { value: "OPEN", label: "Abierto" },
  { value: "IN_PROGRESS", label: "En curso" },
  { value: "WAITING_ON_CLIENT", label: "Esperando al cliente" },
  { value: "RESOLVED", label: "Resuelto" },
  { value: "CLOSED", label: "Cerrado" },
];

export function StatusChanger({ ticketId, status }: { ticketId: string; status: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => startTransition(() => updateStatusAction(fd))}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="ticketId" value={ticketId} />
      <label htmlFor="status" className="text-xs text-muted">
        Estado
      </label>
      <select
        id="status"
        name="status"
        defaultValue={status}
        disabled={pending}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-border bg-white px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-accent disabled:opacity-60"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </form>
  );
}
