import { describe, expect, it } from "vitest";
import { signProToken, verifyProToken } from "./pro-token";
import type { ProTokenPayload } from "./types";

const secret = "test-secret";
const payload: ProTokenPayload = {
  anonId: "anon-123",
  customerId: "cus_123",
  subscriptionId: "sub_123",
  exp: Math.floor(Date.now() / 1000) + 3600,
};

describe("pro-token", () => {
  it("signs and verifies a valid token", () => {
    expect(verifyProToken(signProToken(payload, secret), secret)).toEqual(payload);
  });

  it("rejects tampering and wrong secrets", () => {
    const token = signProToken(payload, secret);
    expect(verifyProToken(`${token}x`, secret)).toBeNull();
    expect(verifyProToken(token, "other-secret")).toBeNull();
    expect(verifyProToken(null, secret)).toBeNull();
  });

  it("rejects an expired token", () => {
    const expired = { ...payload, exp: Math.floor(Date.now() / 1000) - 1 };
    expect(verifyProToken(signProToken(expired, secret), secret)).toBeNull();
  });
});
