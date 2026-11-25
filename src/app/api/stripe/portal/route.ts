import { z } from "zod";
import { verifyProToken } from "@/lib/pro-token";
import { getAppUrl, getProSecret, getStripe } from "@/lib/stripe";

const bodySchema = z.object({ token: z.string().min(8).max(2048) });

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = getProSecret();
  if (!stripe || !secret) {
    return Response.json({ error: "Stripe не настроен" }, { status: 503 });
  }
  try {
    const { token } = bodySchema.parse(await request.json());
    const payload = verifyProToken(token, secret);
    if (!payload) return Response.json({ error: "Недействительный токен" }, { status: 401 });

    const session = await stripe.billingPortal.sessions.create({
      customer: payload.customerId,
      return_url: `${getAppUrl()}/billing`,
    });
    return Response.json({ url: session.url });
  } catch {
    return Response.json({ error: "Не удалось открыть управление подпиской" }, { status: 400 });
  }
}
