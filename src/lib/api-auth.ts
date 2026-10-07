import { getClientSession } from "@/lib/client-context";
import { isSupportedDashboardClient } from "@/lib/client-adapters";
import { privateJson } from "@/lib/http-security";
import { hasClientCapability, type ClientCapability } from "@/lib/roles";

export async function requireClientApi() {
  const session = await getClientSession();
  if (!session) return { response: privateJson({ error: "unauthorized" }, 401) } as const;
  if (!isSupportedDashboardClient(session.client.slug)) return { response: privateJson({ error: "unsupported_client" }, 403) } as const;
  return { session } as const;
}

export async function requireClientCapabilityApi(capability: ClientCapability) {
  const auth = await requireClientApi();
  if ("response" in auth) return auth;
  if (!hasClientCapability(auth.session.profile.role, capability)) return { response: privateJson({ error: "forbidden_capability" }, 403) } as const;
  return auth;
}
