import { notFound } from "next/navigation";
import { hasCapability } from "./access";
import { getDemoView } from "./demo-data";
import { requireClientAccess } from "./client-context";

export type DemoSearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function resolveView(searchParams: DemoSearchParams) {
  const session = await requireClientAccess();
  if (!hasCapability(session.profile, "dashboard:read")) notFound();
  const params = await searchParams;
  const tenant = params.tenant ?? session.client.id;
  if (tenant !== session.client.id) notFound();
  try {
    return { ...getDemoView(tenant, params.period), profile: session.profile };
  } catch (error) {
    if (error instanceof RangeError) notFound();
    throw error;
  }
}
