import { NextRequest, NextResponse } from "next/server";
import { requireClientApi } from "@/lib/api-auth";
import { signSession, validSecret } from "@/lib/demo-session-crypto";
import { SESSION_COOKIE } from "@/lib/demo-session";
import { privateJson, sameOrigin } from "@/lib/http-security";
import { readBoundedUrlEncoded } from "@/lib/request-security";
import { applyPrivateResponseHeaders } from "@/lib/response-security";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return privateJson({ error: "invalid_origin" }, 403);
  const auth = await requireClientApi();
  if ("response" in auth) return auth.response;
  const body = await readBoundedUrlEncoded(request, { maxBytes: 1024 });
  if (!body.ok) return body.response;
  if (body.value.getAll("clientId").length !== 1) return privateJson({ error: "invalid_client" }, 400);
  const client = auth.session.clients.find((item) => item.id === body.value.get("clientId"));
  if (!client) return privateJson({ error: "forbidden_client" }, 403);
  const secret = process.env.DEMO_SESSION_SECRET;
  if (!validSecret(secret)) return privateJson({ error: "demo_not_configured" }, 503);
  const response = NextResponse.redirect(new URL("/", request.url), 303);
  applyPrivateResponseHeaders(response.headers);
  response.cookies.set(SESSION_COOKIE, signSession(auth.session.profile.id, client.id, secret), {
    httpOnly: true, sameSite: "strict", secure: new URL(request.url).protocol === "https:", path: "/", maxAge: 12 * 60 * 60
  });
  return response;
}
