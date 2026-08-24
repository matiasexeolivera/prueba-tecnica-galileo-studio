import { Logomark } from "@/components/Logomark";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 bg-brand-bg text-brand-fg relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-80 w-[36rem] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(closest-side, #4338ca, transparent)" }}
      />

      <div className="relative mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Logomark className="w-7 h-7 text-accent" />
          <p className="text-sm font-semibold tracking-widest uppercase">Galileo Studio</p>
        </div>
        <h1 className="text-2xl font-semibold">Portal de clientes</h1>
        <p className="text-sm text-brand-fg-muted mt-1">
          Seguimiento de tus incidencias y solicitudes, en un solo lugar.
        </p>
      </div>

      <div className="relative w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
