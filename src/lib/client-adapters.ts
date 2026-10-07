export const SUPPORTED_DASHBOARD_CLIENT_SLUGS = ["aurora", "horizonte"] as const;
export type DashboardClientAdapter = (typeof SUPPORTED_DASHBOARD_CLIENT_SLUGS)[number];

export class UnsupportedDashboardClientError extends Error {
  readonly clientSlug: string;

  constructor(clientSlug: string) {
    super("Dashboard adapter unavailable for this client");
    this.name = "UnsupportedDashboardClientError";
    this.clientSlug = clientSlug;
  }
}

export function getDashboardClientAdapter(clientSlug: string): DashboardClientAdapter {
  if (clientSlug === "aurora" || clientSlug === "horizonte") return clientSlug;
  throw new UnsupportedDashboardClientError(clientSlug);
}

export function isSupportedDashboardClient(clientSlug: string): clientSlug is DashboardClientAdapter {
  return SUPPORTED_DASHBOARD_CLIENT_SLUGS.includes(clientSlug as DashboardClientAdapter);
}
