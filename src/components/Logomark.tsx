// Simple orbit-and-dot mark referencing "Galileo"; not a copy of galileostudio.ai's real branding.
export function Logomark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="3.2" fill="currentColor" />
      <ellipse
        cx="16"
        cy="16"
        rx="14"
        ry="6"
        stroke="currentColor"
        strokeWidth="1.6"
        transform="rotate(-24 16 16)"
      />
    </svg>
  );
}
