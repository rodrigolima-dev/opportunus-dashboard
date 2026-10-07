import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/demo-session";
import { privateJson, sameOrigin } from "@/lib/http-security";
import { applyPrivateResponseHeaders } from "@/lib/response-security";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return privateJson({ error: "invalid_origin" }, 403);
  const response = NextResponse.redirect(new URL("/login", request.url), 303);
  applyPrivateResponseHeaders(response.headers);
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "strict", secure: new URL(request.url).protocol === "https:", path: "/", maxAge: 0 });
  return response;
}
