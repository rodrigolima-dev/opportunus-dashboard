import test from "node:test";
import assert from "node:assert/strict";
import { canAccessTenant, getProfile, hasCapability, listProfiles } from "../src/lib/access.ts";
import { signSession, verifySession } from "../src/lib/demo-session-crypto.ts";
import { getDashboardClientAdapter, isSupportedDashboardClient } from "../src/lib/client-adapters.ts";

const secret = "unit-test-only-secret-with-adequate-length-123456";

test("membership is checked in both tenant directions", () => {
  const aurora = getProfile("demo-aurora");
  const horizonte = getProfile("demo-horizonte");
  assert.ok(aurora && horizonte);
  assert.equal(canAccessTenant(aurora, "aurora"), true);
  assert.equal(canAccessTenant(aurora, "horizonte"), false);
  assert.equal(canAccessTenant(horizonte, "horizonte"), true);
  assert.equal(canAccessTenant(horizonte, "aurora"), false);
  assert.equal(canAccessTenant(aurora, "unknown"), false);
});

test("roles grant only listed capabilities", () => {
  const viewer = getProfile("demo-aurora");
  const admin = getProfile("demo-admin");
  assert.ok(viewer && admin);
  assert.equal(hasCapability(viewer, "orders:read"), true);
  assert.equal(hasCapability(viewer, "crm:manage"), false);
  assert.equal(hasCapability(viewer, "admin:read"), false);
  assert.equal(hasCapability(admin, "crm:manage"), true);
  assert.equal(listProfiles().length, 3);
  assert.equal(getProfile("production-user"), null);
});

test("signed session rejects modification, wrong key and expiry", () => {
  const now = 1_700_000_000_000;
  const token = signSession("demo-aurora", "aurora", secret, now);
  assert.equal(verifySession(token, secret, now + 1000)?.profileId, "demo-aurora");
  assert.equal(verifySession(token, secret, now + 1000)?.tenantId, "aurora");
  assert.equal(verifySession(token, `${secret}-wrong`, now + 1000), null);
  assert.equal(verifySession(`${token}x`, secret, now + 1000), null);
  assert.equal(verifySession(token, secret, now + 12 * 60 * 60 * 1000), null);
  assert.equal(verifySession("invalid", secret, now), null);
  assert.equal(verifySession(token, "PLACEHOLDER", now), null);
});

test("adapter registry fails closed for unknown clients", () => {
  assert.equal(getDashboardClientAdapter("aurora"), "aurora");
  assert.equal(getDashboardClientAdapter("horizonte"), "horizonte");
  assert.equal(isSupportedDashboardClient("private-tenant"), false);
  assert.throws(() => getDashboardClientAdapter("private-tenant"), /adapter unavailable/i);
});
