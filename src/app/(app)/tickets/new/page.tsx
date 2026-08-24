import { redirect } from "next/navigation";
import { requireSession, isStaff } from "@/lib/authz";
import { NewTicketForm } from "./NewTicketForm";

export default async function NewTicketPage() {
  const session = await requireSession();
  if (isStaff(session)) redirect("/dashboard");

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold mb-1">Nueva solicitud</h1>
      <p className="text-sm text-muted mb-6">
        Describe qué necesitas. Un miembro del equipo lo revisará y verás el estado en tiempo real
        aquí, sin necesidad de escribir por WhatsApp o email.
      </p>
      <NewTicketForm />
    </div>
  );
}
