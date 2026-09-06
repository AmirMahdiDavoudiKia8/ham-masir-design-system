import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "hammasir_admin";

/**
 * Guards every /mentor/admin/* page (analytics, reliability, the demo-plan
 * editor) — previously reachable by anyone who found the URL, since
 * "unlinked from the nav" was the only protection. The demo-plan editor in
 * particular is a write path (defaces the shared study plan every
 * non-subscribed student sees), not just a read, so this needs to be a real
 * check, not just obscurity. Same low-security-but-real-enough posture as
 * the rest of the app's auth (plaintext passwords, unsigned session
 * cookies) — a single shared secret in .env.local, not a per-admin account,
 * since there's exactly one operator.
 */
export async function isAdminSession(): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const jar = await cookies();
  return jar.get(ADMIN_SESSION_COOKIE)?.value === secret;
}

export async function verifyAdminSecret(candidate: string): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  return Boolean(secret) && candidate === secret;
}

export async function setAdminSessionCookie(secret: string): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, secret, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}
