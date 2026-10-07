import { hasClientCapability, type ClientCapability, type UserRole } from "./roles.ts";

export type TenantId = "aurora" | "horizonte";
export type Capability = ClientCapability;
export type ProfileId = "demo-admin" | "demo-aurora" | "demo-horizonte";

export type DemoProfile = { id: ProfileId; label: string; role: UserRole; tenants: readonly TenantId[] };

const profiles: Record<ProfileId, DemoProfile> = {
  "demo-admin": { id: "demo-admin", label: "Administração fictícia", role: "admin", tenants: ["aurora", "horizonte"] },
  "demo-aurora": { id: "demo-aurora", label: "Leitura Aurora", role: "viewer", tenants: ["aurora"] },
  "demo-horizonte": { id: "demo-horizonte", label: "Administração Horizonte", role: "admin", tenants: ["horizonte"] }
};

export function getProfile(value: unknown): DemoProfile | null {
  if (typeof value !== "string" || !Object.hasOwn(profiles, value)) return null;
  return profiles[value as ProfileId];
}

export function listProfiles(): DemoProfile[] {
  return Object.values(profiles).map((profile) => ({ ...profile, tenants: [...profile.tenants] }));
}

export function isTenantId(value: unknown): value is TenantId {
  return value === "aurora" || value === "horizonte";
}

export function canAccessTenant(profile: DemoProfile, tenant: unknown): tenant is TenantId {
  return isTenantId(tenant) && profile.tenants.includes(tenant);
}

export function hasCapability(profile: DemoProfile, capability: Capability): boolean {
  return hasClientCapability(profile.role, capability);
}
