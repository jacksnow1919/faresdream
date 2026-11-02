import { useSession } from "@tanstack/react-start/server";
import type { StaffRole } from "./staff-auth.server";

export type AdminSession = {
  admin?: boolean;
  role?: StaffRole;
  staffId?: string | null;
  email?: string;
};

export function adminSessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "bcd-admin",
    maxAge: 60 * 60 * 8,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

/** Returns true when the caller holds a valid signed admin session cookie. */
export async function isAdminRequest(): Promise<boolean> {
  const session = await useSession<AdminSession>(adminSessionConfig());
  return session.data.admin === true;
}

export type AdminActor = {
  role: StaffRole;
  staffId: string | null;
  email: string;
};

/** Returns the signed-in staff actor, or null when there is no valid session. */
export async function getAdminActor(): Promise<AdminActor | null> {
  const session = await useSession<AdminSession>(adminSessionConfig());
  if (session.data.admin !== true) return null;
  return {
    role: (session.data.role ?? "superadmin") as StaffRole,
    staffId: session.data.staffId ?? null,
    email: session.data.email ?? "",
  };
}
