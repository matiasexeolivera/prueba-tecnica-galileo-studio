import { z } from "zod";

// Runtime validation for every Server Action that accepts user input. Type assertions on
// FormData values (`as "X" | "Y"`) only satisfy the compiler — they don't check anything at
// runtime, so a malformed request would otherwise fail deep inside Prisma with a raw error
// instead of a clear, field-specific message.

export const loginSchema = z.object({
  email: z.email("Ingresá un email válido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

export const createTicketSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio.").max(200, "El título es muy largo."),
  description: z.string().trim().min(1, "La descripción es obligatoria."),
  type: z.enum(["INCIDENT", "REQUEST", "QUESTION"], { error: "Elegí un tipo válido." }),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"], { error: "Elegí una prioridad válida." }),
});

export const commentSchema = z.object({
  ticketId: z.string().min(1),
  body: z.string().trim().min(1, "Escribe un mensaje antes de enviar."),
});

export const updateStatusSchema = z.object({
  ticketId: z.string().min(1),
  status: z.enum(["OPEN", "IN_PROGRESS", "WAITING_ON_CLIENT", "RESOLVED", "CLOSED"], {
    error: "Estado inválido.",
  }),
});

/** Returns the first validation error message, or null if the input is valid. */
export function firstIssueMessage(result: { success: boolean; error?: z.ZodError }) {
  if (result.success || !result.error) return null;
  return result.error.issues[0]?.message ?? "Datos inválidos.";
}
