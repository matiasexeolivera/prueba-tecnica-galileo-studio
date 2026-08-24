import type { Session as AuthSession } from "next-auth";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export type Session = AuthSession;

// Requires a valid session; defense in depth alongside the proxy middleware, never relied on alone.
export async function requireSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export function isStaff(session: Session) {
  return session.user.role === "STAFF_ADMIN" || session.user.role === "STAFF_AGENT";
}

// Requires a staff session; redirects client users to the dashboard.
export async function requireStaff(): Promise<Session> {
  const session = await requireSession();
  if (!isStaff(session)) redirect("/dashboard");
  return session;
}
