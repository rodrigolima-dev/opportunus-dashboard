import { NextResponse, type NextRequest } from "next/server";
import { applyPrivateResponseHeaders } from "@/lib/response-security";

export function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  return origin === url.origin;
}

export function privateJson(body: unknown, status = 200) {
  const response = NextResponse.json(body, { status });
  applyPrivateResponseHeaders(response.headers);
  response.headers.set("X-Content-Type-Options", "nosniff");
  return response;
}
