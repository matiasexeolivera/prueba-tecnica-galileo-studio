"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/authz";
import { addComment, updateTicketStatus } from "@/lib/tickets";
import { commentSchema, updateStatusSchema, firstIssueMessage } from "@/lib/validation";

export type CommentState = { error: string | null };

export async function addCommentAction(
  _prevState: CommentState,
  formData: FormData
): Promise<CommentState> {
  const session = await requireSession();

  const parsed = commentSchema.safeParse({
    ticketId: formData.get("ticketId"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return { error: firstIssueMessage(parsed) };
  }

  try {
    await addComment(session, parsed.data.ticketId, parsed.data.body);
  } catch {
    return { error: "No se pudo enviar el comentario." };
  }

  revalidatePath(`/tickets/${parsed.data.ticketId}`);
  return { error: null };
}

export async function updateStatusAction(formData: FormData) {
  const session = await requireSession();

  const parsed = updateStatusSchema.safeParse({
    ticketId: formData.get("ticketId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  await updateTicketStatus(session, parsed.data.ticketId, parsed.data.status);
  revalidatePath(`/tickets/${parsed.data.ticketId}`);
  revalidatePath("/dashboard");
}
