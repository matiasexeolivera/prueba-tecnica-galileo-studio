import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold tracking-widest text-accent uppercase mb-2">
          Galileo Studio
        </p>
        <h1 className="text-2xl font-semibold">Portal de clientes</h1>
        <p className="text-sm text-muted mt-1">
          Seguimiento de tus incidencias y solicitudes, en un solo lugar.
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
