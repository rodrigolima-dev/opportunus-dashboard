import { NextRequest } from "next/server";
import { type Capability } from "@/lib/access";
import { requireClientCapabilityApi } from "@/lib/api-auth";
import { getDemoView } from "@/lib/demo-data";
import { privateJson } from "@/lib/http-security";

export async function readTenantView(request: NextRequest, tenant: string, capability: Capability) {
  const auth = await requireClientCapabilityApi(capability);
  if ("response" in auth) return { error: auth.response } as const;
  if (auth.session.client.id !== tenant) return { error: privateJson({ error: "forbidden_tenant" }, 403) } as const;
  const period = request.nextUrl.searchParams.get("period") ?? "7d";
  try {
    return { view: getDemoView(tenant, period) } as const;
  } catch {
    return { error: privateJson({ error: "invalid_period" }, 400) } as const;
  }
}
