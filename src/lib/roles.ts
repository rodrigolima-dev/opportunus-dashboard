export type UserRole = "admin" | "viewer";

export const clientCapabilities = {
  dashboardRead: "dashboard:read",
  ordersRead: "orders:read",
  leadsRead: "leads:read",
  crmManage: "crm:manage",
  adminRead: "admin:read"
} as const;

export type ClientCapability = (typeof clientCapabilities)[keyof typeof clientCapabilities];

const roleCapabilities: Record<UserRole, ReadonlySet<ClientCapability>> = {
  admin: new Set<ClientCapability>(Object.values(clientCapabilities)),
  viewer: new Set<ClientCapability>([
    clientCapabilities.dashboardRead,
    clientCapabilities.ordersRead,
    clientCapabilities.leadsRead
  ])
};

export function hasClientCapability(
  role: unknown,
  capability: ClientCapability
): boolean {
  if (role !== "admin" && role !== "viewer") return false;
  return roleCapabilities[role].has(capability);
}
