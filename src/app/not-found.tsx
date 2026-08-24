import Link from "next/link";
import { Logomark } from "@/components/Logomark";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
      <Logomark className="w-8 h-8 text-accent mb-4" />
      <h1 className="text-lg font-semibold">No encontramos esta página</h1>
      <p className="text-sm text-muted mt-1 max-w-sm">
        Puede que el enlace esté roto o que el recurso no exista (o no tengas acceso a él).
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-lg bg-accent text-white text-sm font-medium px-4 py-2 hover:bg-accent-hover transition-colors"
      >
        Volver al panel
      </Link>
    </main>
  );
}
