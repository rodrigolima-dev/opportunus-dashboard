import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getProfile } from "@/lib/access";
import { signSession, validSecret } from "@/lib/demo-session-crypto";
import { SESSION_COOKIE } from "@/lib/demo-session";
import { privateJson, sameOrigin } from "@/lib/http-security";
import { readBoundedUrlEncoded } from "@/lib/request-security";
import { applyPrivateResponseHeaders } from "@/lib/response-security";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return privateJson({ error: "invalid_origin" }, 403);
  const accessKey = process.env.DEMO_ACCESS_KEY;
  const sessionSecret = process.env.DEMO_SESSION_SECRET;
  if (!validSecret(accessKey) || !validSecret(sessionSecret)) return privateJson({ error: "demo_not_configured" }, 503);
  const body = await readBoundedUrlEncoded(request, { maxBytes: 2048 });
  if (!body.ok) return body.response;
  if (body.value.getAll("profile").length !== 1 || body.value.getAll("accessKey").length !== 1) return privateJson({ error: "invalid_request" }, 400);
  const profile = getProfile(body.value.get("profile"));
  const submitted = body.value.get("accessKey") ?? "";
  const expected = Buffer.from(accessKey);
  const received = Buffer.from(submitted);
  const keyMatches = received.length === expected.length && timingSafeEqual(received, expected);
  if (!profile || !keyMatches) return privateJson({ error: "unauthorized" }, 401);
  const response = NextResponse.redirect(new URL("/", request.url), 303);
  applyPrivateResponseHeaders(response.headers);
  response.cookies.set(SESSION_COOKIE, signSession(profile.id, profile.tenants[0], sessionSecret), {
    httpOnly: true, sameSite: "strict", secure: new URL(request.url).protocol === "https:", path: "/", maxAge: 12 * 60 * 60
  });
  return response;
}
