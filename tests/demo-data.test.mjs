import test from "node:test";
import assert from "node:assert/strict";
import { getDemoView, getTenantOptions } from "../src/lib/demo-data.ts";
import { getExtraData } from "../src/lib/demo-extra-data.ts";

test("each selection returns only its own synthetic records", () => {
  const aurora = getDemoView("aurora", "7d");
  const horizonte = getDemoView("horizonte", "7d");
  assert.deepEqual(getTenantOptions().map(({ id }) => id), ["aurora", "horizonte"]);
  assert.ok(aurora.leads.every(({ id }) => id.startsWith("A-")));
  assert.ok(aurora.orders.every(({ id }) => id.startsWith("A-")));
  assert.ok(horizonte.leads.every(({ id }) => id.startsWith("H-")));
  assert.ok(horizonte.orders.every(({ id }) => id.startsWith("H-")));
  assert.notDeepEqual(aurora.daily, horizonte.daily);
});

test("unrecognized or repeated selection fails closed", () => {
  assert.throws(() => getDemoView("real-client", "7d"), RangeError);
  assert.throws(() => getDemoView(["aurora", "horizonte"], "7d"), RangeError);
  assert.throws(() => getDemoView("aurora", "all"), RangeError);
});

test("period totals use only selected days", () => {
  const week = getDemoView("aurora", "7d");
  const month = getDemoView("aurora", "30d");
  assert.equal(week.daily.length, 7);
  assert.equal(month.daily.length, 30);
  assert.equal(week.totals.revenue, week.daily.reduce((sum, point) => sum + point.revenue, 0));
  assert.ok(month.totals.revenue > week.totals.revenue);
});

test("returned records cannot mutate the next selection", () => {
  const first = getDemoView("aurora", "7d");
  first.leads[0].company = "Changed locally";
  first.orders[0].value = 0;
  const again = getDemoView("aurora", "7d");
  assert.equal(again.leads[0].company, "Empresa A-01");
  assert.equal(again.orders[0].value, 540);
});

test("additional route fixtures remain tenant-specific", () => {
  const aurora = getExtraData("aurora");
  const horizonte = getExtraData("horizonte");
  assert.ok(aurora.products.every((item) => item.id.startsWith("A-")));
  assert.ok(horizonte.products.every((item) => item.id.startsWith("H-")));
  assert.ok(aurora.campaigns.every((item) => item.id.startsWith("A-")));
  assert.ok(horizonte.followups.every((item) => item.id.startsWith("H-")));
  assert.throws(() => getExtraData("unknown"), RangeError);
});
