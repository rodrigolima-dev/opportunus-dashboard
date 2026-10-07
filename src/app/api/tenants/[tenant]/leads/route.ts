import { NextRequest } from "next/server";
import { readTenantView } from "@/lib/api-read-model";
import { privateJson } from "@/lib/http-security";

export async function GET(request: NextRequest, { params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const result = await readTenantView(request, tenant, "leads:read");
  if ("error" in result) return result.error;
  return privateJson({ tenant: result.view.tenant.id, leads: result.view.leads });
}
