import { cache } from "react";
import { redirect } from "next/navigation";
import { canAccessTenant, getProfile, type DemoProfile, type TenantId } from "@/lib/access";
import { getDashboardClientAdapter } from "@/lib/client-adapters";
import { getTenantOptions } from "@/lib/demo-data";
import { readDemoClaims } from "@/lib/demo-session";

export type UserClient = { id: TenantId; slug: TenantId; name: string; role: DemoProfile["role"] };
export type ClientSession = { profile: DemoProfile; client: UserClient; clients: UserClient[] };

export function getUserClients(profile: DemoProfile): UserClient[] {
  const names = new Map(getTenantOptions().map((tenant) => [tenant.id, tenant.name]));
  return profile.tenants.map((id) => ({ id, slug: getDashboardClientAdapter(id), name: names.get(id) ?? id, role: profile.role }));
}

export const getClientSession = cache(async (): Promise<ClientSession | null> => {
  const claims = await readDemoClaims();
  const profile = claims ? getProfile(claims.profileId) : null;
  if (!profile || !canAccessTenant(profile, claims?.tenantId)) return null;
  const clients = getUserClients(profile);
  const client = clients.find((item) => item.id === claims.tenantId);
  return client ? { profile, client, clients } : null;
});

export async function requireClientAccess() {
  const session = await getClientSession();
  if (!session) redirect("/login");
  return session;
}
