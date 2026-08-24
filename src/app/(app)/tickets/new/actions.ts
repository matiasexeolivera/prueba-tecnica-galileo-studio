"use server";

import { redirect } from "next/navigation";
import { requireSession } from "@/lib/authz";
import { createTicket } from "@/lib/tickets";
import { createTicketSchema, firstIssueMessage } from "@/lib/validation";

export type NewTicketState = { error: string | null };

export async function createTicketAction(
  _prevState: NewTicketState,
  formData: FormData
): Promise<NewTicketState> {
  const session = await requireSession();

  const parsed = createTicketSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    priority: formData.get("priority"),
  });
  if (!parsed.success) {
    return { error: firstIssueMessage(parsed) };
  }

  const ticket = await createTicket(session, parsed.data);
  redirect(`/tickets/${ticket.id}`);
}
