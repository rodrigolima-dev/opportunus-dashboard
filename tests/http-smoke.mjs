import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";

async function freePort() {
  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const port = server.address().port;
  server.close();
  await once(server, "close");
  return port;
}

const port = await freePort();
const base = `http://localhost:${port}`;
const accessKey = randomBytes(32).toString("hex");
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(port)], {
  env: { ...process.env, DEMO_ACCESS_KEY: accessKey, DEMO_SESSION_SECRET: randomBytes(32).toString("hex") },
  stdio: ["ignore", "pipe", "pipe"]
});
let serverOutput = "";
for (const stream of [child.stdout, child.stderr]) stream.on("data", (chunk) => {
  serverOutput = `${serverOutput}${chunk}`.slice(-3000);
});

async function request(path, options = {}) {
  return fetch(`${base}${path}`, { redirect: "manual", ...options });
}

async function post(path, body, cookie, origin = base) {
  return request(path, {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/x-www-form-urlencoded",
      ...(cookie ? { cookie } : {})
    },
    body
  });
}

async function login(profile) {
  const response = await post("/api/auth/login", new URLSearchParams({ profile, accessKey }));
  assert.equal(response.status, 303);
  const setCookie = response.headers.get("set-cookie") ?? "";
  assert.match(setCookie, /httponly/i);
  assert.match(setCookie, /samesite=strict/i);
  return setCookie.split(";", 1)[0];
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) break;
    try {
      const response = await request("/login");
      if (response.status === 200) { ready = true; break; }
    } catch { /* The server is still starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  assert.ok(ready, `Local server did not start: ${serverOutput}`);

  assert.equal((await request("/api/tenants/aurora/summary")).status, 401);
  assert.equal((await post("/api/auth/login", "profile=demo-admin", null, "https://unrelated.invalid")).status, 403);
  assert.equal((await post("/api/auth/login", `profile=demo-admin&accessKey=${"x".repeat(2100)}`)).status, 413);

  let cookie = await login("demo-admin");
  let response = await request("/api/tenants/aurora/summary", { headers: { cookie } });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control") ?? "", /no-store/);
  assert.equal((await request("/api/tenants/horizonte/summary", { headers: { cookie } })).status, 403);
  assert.equal((await post("/api/auth/select-client", "clientId=horizonte", cookie, "https://unrelated.invalid")).status, 403);

  response = await post("/api/auth/select-client", "clientId=horizonte", cookie);
  assert.equal(response.status, 303);
  cookie = (response.headers.get("set-cookie") ?? "").split(";", 1)[0];
  assert.equal((await request("/api/tenants/horizonte/summary", { headers: { cookie } })).status, 200);
  assert.equal((await request("/api/tenants/aurora/summary", { headers: { cookie } })).status, 403);

  const viewerCookie = await login("demo-aurora");
  assert.equal((await post("/api/auth/select-client", "clientId=horizonte", viewerCookie)).status, 403);
  assert.equal((await request("/crm", { headers: { cookie: viewerCookie } })).status, 404);
  assert.equal((await request("/api/tenants/horizonte/orders", { headers: { cookie: viewerCookie } })).status, 403);

  response = await post("/api/auth/logout", "", cookie);
  assert.equal(response.status, 303);
  const clearedCookie = (response.headers.get("set-cookie") ?? "").split(";", 1)[0];
  assert.equal((await request("/api/tenants/horizonte/summary", { headers: { cookie: clearedCookie } })).status, 401);
  process.stdout.write("HTTP smoke passed: 401/403/404, tenant switching, origin, body limit, private cache and logout.\n");
} finally {
  child.kill();
  if (child.exitCode === null) await Promise.race([once(child, "exit"), new Promise((resolve) => setTimeout(resolve, 3000))]);
}
