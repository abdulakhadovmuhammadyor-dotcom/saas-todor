import { createHmac, timingSafeEqual } from "node:crypto";
import type { ProTokenPayload } from "@/lib/types";

export function signProToken(payload: ProTokenPayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

export function verifyProToken(token: string | null | undefined, secret: string): ProTokenPayload | null {
  if (!token || !secret) return null;
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra) return null;

  const expected = createHmac("sha256", secret).update(body).digest();
  let provided: Buffer;
  try {
    provided = Buffer.from(signature, "base64url");
  } catch {
    return null;
  }
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;

  try {
    const parsed: unknown = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!parsed || typeof parsed !== "object") return null;
    const payload = parsed as Partial<ProTokenPayload>;
    if (
      typeof payload.anonId !== "string" ||
      typeof payload.customerId !== "string" ||
      typeof payload.subscriptionId !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp <= Date.now() / 1000
    ) {
      return null;
    }
    return payload as ProTokenPayload;
  } catch {
    return null;
  }
}
