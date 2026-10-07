import { NextRequest } from "next/server";
import { readTenantView } from "@/lib/api-read-model";
import { privateJson } from "@/lib/http-security";

export async function GET(request: NextRequest, { params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params;
  const result = await readTenantView(request, tenant, "dashboard:read");
  if ("error" in result) return result.error;
  const { tenant: client, period, totals, conversion } = result.view;
  return privateJson({ tenant: client.id, period, totals, conversion });
}
