"use client";

import { useActionState, useRef } from "react";
import { addCommentAction, type CommentState } from "./actions";

const initialState: CommentState = { error: null };

export function CommentForm({ ticketId }: { ticketId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(async (prev: CommentState, fd: FormData) => {
    const result = await addCommentAction(prev, fd);
    if (!result.error) formRef.current?.reset();
    return result;
  }, initialState);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="ticketId" value={ticketId} />
      <textarea
        name="body"
        rows={3}
        required
        placeholder="Escribe una actualización o pregunta..."
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none focus:ring-2 focus:ring-accent"
      />
      {state.error && <p className="text-xs text-[var(--danger)]">{state.error}</p>}
      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-accent text-white text-sm font-medium px-4 py-2 hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {pending ? "Enviando..." : "Comentar"}
        </button>
      </div>
    </form>
  );
}
