import type { NextResponse } from "next/server";

const PRIVATE_CACHE_CONTROL = "private, no-cache, no-store, must-revalidate, max-age=0";

export function applyPrivateResponseHeaders(
  headers: Headers,
  upstreamHeaders: Record<string, string> = {}
) {
  for (const [key, value] of Object.entries(upstreamHeaders)) {
    headers.set(key, value);
  }

  headers.set("Cache-Control", PRIVATE_CACHE_CONTROL);
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
}

export function inheritPrivateResponseState(source: NextResponse, target: NextResponse) {
  source.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") {
      target.headers.set(key, value);
    }
  });
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }
  applyPrivateResponseHeaders(target.headers);
  return target;
}
