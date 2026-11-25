import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return Response.json({ error: "Webhook не настроен" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Отсутствует подпись" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return Response.json({ error: "Неверная подпись" }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const id = event.id;
    console.info("[stripe-webhook]", event.type, id);
  }

  return Response.json({ received: true });
}
