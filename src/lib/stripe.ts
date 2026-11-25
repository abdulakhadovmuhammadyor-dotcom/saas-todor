import Stripe from "stripe";
import { STRIPE_STATUS_CACHE_MS } from "@/lib/constants";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) stripeClient = new Stripe(key);
  return stripeClient;
}

const statusCache = new Map<string, { active: boolean; at: number }>();

export async function isSubscriptionActive(subscriptionId: string): Promise<boolean> {
  const cached = statusCache.get(subscriptionId);
  if (cached && Date.now() - cached.at < STRIPE_STATUS_CACHE_MS) return cached.active;

  const stripe = getStripe();
  if (!stripe) return false;

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const active = subscription.status === "active" || subscription.status === "trialing";
    statusCache.set(subscriptionId, { active, at: Date.now() });
    return active;
  } catch {
    statusCache.set(subscriptionId, { active: false, at: Date.now() });
    return false;
  }
}

export function getAppUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function getProSecret(): string | undefined {
  return process.env.PRO_TOKEN_SECRET;
}

export function hasStripeConfig(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID);
}
