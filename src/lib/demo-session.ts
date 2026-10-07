import { cookies } from "next/headers";
import { verifySession } from "@/lib/demo-session-crypto";

export const SESSION_COOKIE = "op_demo_session";

export async function readDemoClaims() {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value, process.env.DEMO_SESSION_SECRET);
}
