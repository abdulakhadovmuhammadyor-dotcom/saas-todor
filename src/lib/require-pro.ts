import { verifyProToken } from "@/lib/pro-token";
import { getProSecret, isSubscriptionActive } from "@/lib/stripe";

export async function isProRequest(request: Request): Promise<boolean> {
  if (
    request.headers.get("x-demo-pro") === "1" &&
    process.env.NODE_ENV !== "production"
  ) {
    return true;
  }

  const secret = getProSecret();
  if (!secret) return false;
  const payload = verifyProToken(request.headers.get("x-pro-token"), secret);
  if (!payload) return false;
  return isSubscriptionActive(payload.subscriptionId);
}
