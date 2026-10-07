import { createHmac, timingSafeEqual } from "node:crypto";

export type SessionClaims = { profileId: string; tenantId: string; expiresAt: number };
const SESSION_SECONDS = 12 * 60 * 60;

export function validSecret(value: unknown): value is string {
  return typeof value === "string" && value.length >= 32 && !/replace|placeholder|example|your_/i.test(value);
}

function mac(payload: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(payload).digest();
}

export function signSession(profileId: string, tenantId: string, secret: string, now = Date.now()): string {
  if (!validSecret(secret)) throw new Error("Demo session secret is not configured");
  const payload = Buffer.from(JSON.stringify({ profileId, tenantId, expiresAt: now + SESSION_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${mac(payload, secret).toString("base64url")}`;
}

export function verifySession(token: unknown, secret: unknown, now = Date.now()): SessionClaims | null {
  if (typeof token !== "string" || !validSecret(secret)) return null;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts.every((part) => /^[A-Za-z0-9_-]+$/.test(part))) return null;
  const [payload, signature] = parts;
  const received = Buffer.from(signature, "base64url");
  const expected = mac(payload, secret);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;
  try {
    const decoded: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!decoded || typeof decoded !== "object") return null;
    const claims = decoded as Partial<SessionClaims>;
    const expiresAt = claims.expiresAt;
    if (typeof claims.profileId !== "string" || typeof claims.tenantId !== "string" || typeof expiresAt !== "number" || !Number.isSafeInteger(expiresAt)) return null;
    if (expiresAt <= now || expiresAt > now + SESSION_SECONDS * 1000) return null;
    return { profileId: claims.profileId, tenantId: claims.tenantId, expiresAt };
  } catch {
    return null;
  }
}
