import { NextResponse } from "next/server";

export const DEFAULT_JSON_BODY_LIMIT_BYTES = 64 * 1024;

type BoundedJsonResult<T> =
  | { ok: true; value: T }
  | { ok: false; response: NextResponse };

type BoundedBytesResult =
  | { ok: true; value: Uint8Array }
  | { ok: false; response: NextResponse };

function requestError(message: string, status: number, code: string) {
  return NextResponse.json(
    { error: { code, message } },
    {
      status,
      headers: {
        "Cache-Control": "private, no-store"
      }
    }
  );
}

function invalidJson() {
  return requestError("Corpo JSON inválido.", 400, "invalid_json");
}

function validatedLimit(maxBytes: number) {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) {
    throw new Error("maxBytes precisa ser um inteiro positivo.");
  }
  return maxBytes;
}

async function readBoundedBytes(request: Request, maxBytes: number): Promise<BoundedBytesResult> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null) {
    if (!/^\d+$/.test(declaredLength)) {
      return { ok: false, response: invalidJson() };
    }
    if (Number(declaredLength) > maxBytes) {
      return {
        ok: false,
        response: requestError("Corpo da requisição muito grande.", 413, "payload_too_large")
      };
    }
  }

  if (!request.body) {
    return { ok: false, response: invalidJson() };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      receivedBytes += value.byteLength;
      if (receivedBytes > maxBytes) {
        await reader.cancel("payload_too_large").catch(() => undefined);
        return {
          ok: false,
          response: requestError("Corpo da requisição muito grande.", 413, "payload_too_large")
        };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, response: invalidJson() };
  }

  if (receivedBytes === 0) {
    return { ok: false, response: invalidJson() };
  }

  const bytes = new Uint8Array(receivedBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return { ok: true, value: bytes };
}

export function isJsonObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export async function readBoundedJson(
  request: Request,
  options: { maxBytes?: number } = {}
): Promise<BoundedJsonResult<unknown>> {
  const maxBytes = validatedLimit(options.maxBytes ?? DEFAULT_JSON_BODY_LIMIT_BYTES);

  const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") {
    return {
      ok: false,
      response: requestError("Envie os dados como JSON.", 415, "unsupported_media_type")
    };
  }

  const bytes = await readBoundedBytes(request, maxBytes);
  if (!bytes.ok) return bytes;

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes.value);
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, response: invalidJson() };
  }
}

export async function readBoundedUrlEncoded(
  request: Request,
  options: { maxBytes?: number } = {}
): Promise<BoundedJsonResult<URLSearchParams>> {
  const maxBytes = validatedLimit(options.maxBytes ?? DEFAULT_JSON_BODY_LIMIT_BYTES);
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (mediaType !== "application/x-www-form-urlencoded") {
    return {
      ok: false,
      response: requestError("Envie os dados como formulário.", 415, "unsupported_media_type")
    };
  }

  const bytes = await readBoundedBytes(request, maxBytes);
  if (!bytes.ok) return bytes;

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes.value);
    return { ok: true, value: new URLSearchParams(text) };
  } catch {
    return { ok: false, response: invalidJson() };
  }
}
