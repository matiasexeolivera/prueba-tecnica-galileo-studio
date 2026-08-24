const STATUS_STYLE: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Abierto", className: "bg-[var(--info-soft)] text-[var(--info)]" },
  IN_PROGRESS: { label: "En curso", className: "bg-accent-soft text-accent" },
  WAITING_ON_CLIENT: {
    label: "Esperando al cliente",
    className: "bg-[var(--warning-soft)] text-[var(--warning)]",
  },
  RESOLVED: { label: "Resuelto", className: "bg-[var(--success-soft)] text-[var(--success)]" },
  CLOSED: { label: "Cerrado", className: "bg-gray-100 text-gray-500" },
};

const PRIORITY_STYLE: Record<string, { label: string; className: string }> = {
  LOW: { label: "Baja", className: "bg-gray-100 text-gray-500" },
  MEDIUM: { label: "Media", className: "bg-[var(--info-soft)] text-[var(--info)]" },
  HIGH: { label: "Alta", className: "bg-[var(--warning-soft)] text-[var(--warning)]" },
  URGENT: { label: "Urgente", className: "bg-[var(--danger-soft)] text-[var(--danger)]" },
};

const TYPE_LABEL: Record<string, string> = {
  INCIDENT: "Incidencia",
  REQUEST: "Solicitud",
  QUESTION: "Duda",
};

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? { label: status, className: "bg-gray-100 text-gray-500" };
  return <Badge label={s.label} className={s.className} />;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const p = PRIORITY_STYLE[priority] ?? { label: priority, className: "bg-gray-100 text-gray-500" };
  return <Badge label={p.label} className={p.className} />;
}

export function TypeBadge({ type }: { type: string }) {
  return <Badge label={TYPE_LABEL[type] ?? type} className="bg-gray-100 text-gray-600" />;
}
