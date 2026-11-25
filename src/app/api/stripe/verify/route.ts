import { z } from "zod";
import { PRO_TOKEN_TTL_SECONDS } from "@/lib/constants";
import { signProToken } from "@/lib/pro-token";
import { getProSecret, getStripe, isSubscriptionActive } from "@/lib/stripe";

const bodySchema = z.object({
  sessionId: z.string().min(8).max(200),
  anonId: z.string().min(8).max(120),
});

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = getProSecret();
  if (!stripe || !secret) {
    return Response.json({ error: "Stripe не настроен" }, { status: 503 });
  }

  try {
    const { sessionId, anonId } = bodySchema.parse(await request.json());
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.status !== "complete") {
      return Response.json({ error: "Оплата не завершена" }, { status: 402 });
    }
    if (session.client_reference_id && session.client_reference_id !== anonId) {
      return Response.json({ error: "Сессия оплаты принадлежит другому устройству" }, { status: 403 });
    }

    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id;
    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    if (!customerId || !subscriptionId) {
      return Response.json({ error: "Не удалось найти подписку" }, { status: 400 });
    }
    if (!(await isSubscriptionActive(subscriptionId))) {
      return Response.json({ error: "Подписка не активна" }, { status: 402 });
    }

    const token = signProToken(
      {
        anonId,
        customerId,
        subscriptionId,
        exp: Math.floor(Date.now() / 1000) + PRO_TOKEN_TTL_SECONDS,
      },
      secret,
    );
    return Response.json({ token, customerId });
  } catch {
    return Response.json({ error: "Не удалось подтвердить оплату" }, { status: 400 });
  }
}
