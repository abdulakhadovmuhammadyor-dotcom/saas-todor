import { z } from "zod";
import { getAppUrl, getStripe } from "@/lib/stripe";

const bodySchema = z.object({
  anonId: z.string().min(8).max(120),
});

export async function POST(request: Request) {
  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!stripe || !priceId) {
    return Response.json(
      { error: "Stripe не настроен. Добавьте STRIPE_SECRET_KEY и STRIPE_PRICE_ID в .env.local" },
      { status: 503 },
    );
  }

  try {
    const { anonId } = bodySchema.parse(await request.json());
    const appUrl = getAppUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: anonId,
      metadata: { anonId },
      allow_promotion_codes: true,
      success_url: `${appUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing?canceled=1`,
    });
    if (!session.url) throw new Error("No checkout URL");
    return Response.json({ url: session.url });
  } catch {
    return Response.json({ error: "Не удалось создать сессию оплаты" }, { status: 400 });
  }
}
