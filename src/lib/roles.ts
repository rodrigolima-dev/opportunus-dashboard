export type UserRole = "opportunus_admin" | "admin" | "funcionario" | "viewer" | "unauthorized";

export const clientCapabilities = {
  dashboardRead: "dashboard:read",
  ordersRead: "orders:read",
  leadsRead: "leads:read",
  crmManage: "crm:manage",
  aiMemoryManage: "ai-memory:manage",
  adminRead: "admin:read"
} as const;

export type ClientCapability = (typeof clientCapabilities)[keyof typeof clientCapabilities];

const allClientCapabilities = new Set<ClientCapability>(Object.values(clientCapabilities));
const roleCapabilities: Record<UserRole, ReadonlySet<ClientCapability>> = {
  opportunus_admin: allClientCapabilities,
  admin: allClientCapabilities,
  funcionario: new Set<ClientCapability>([
    clientCapabilities.ordersRead,
    clientCapabilities.leadsRead,
    clientCapabilities.crmManage
  ]),
  viewer: new Set<ClientCapability>([
    clientCapabilities.dashboardRead,
    clientCapabilities.ordersRead,
    clientCapabilities.leadsRead
  ]),
  unauthorized: new Set<ClientCapability>()
};

export function normalizeUserRole(role: unknown): UserRole {
  if (role === "opportunus_admin") return "opportunus_admin";
  if (role === "admin" || role === "client_admin") return "admin";
  if (role === "operator" || role === "funcionario") return "funcionario";
  if (role === "viewer") return "viewer";
  return "unauthorized";
}

export function hasClientCapability(
  role: UserRole | string | undefined,
  capability: ClientCapability
) {
  return roleCapabilities[normalizeUserRole(role)].has(capability);
}

export function canAccessClientAdmin(role: UserRole | string | undefined) {
  return hasClientCapability(role, clientCapabilities.adminRead);
}

export function shouldRequireClientSelection(role: UserRole | string | undefined) {
  return normalizeUserRole(role) === "opportunus_admin";
}

export function requiresLoginMfa(role: unknown) {
  return normalizeUserRole(role) === "opportunus_admin";
}

export function getDefaultPathForRole(role: UserRole | string | undefined) {
  const normalizedRole = normalizeUserRole(role);
  if (normalizedRole === "admin" || normalizedRole === "opportunus_admin" || normalizedRole === "viewer" || normalizedRole === "unauthorized") return "/";
  return "/crm";
}
