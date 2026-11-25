import { z } from "zod";
import { verifyProToken } from "@/lib/pro-token";
import { getProSecret, hasStripeConfig, isSubscriptionActive } from "@/lib/stripe";

const bodySchema = z.object({
  token: z.string().nullable().optional(),
  demo: z.boolean().optional(),
});

export async function POST(request: Request) {
  const configured = hasStripeConfig();
  try {
    const input = bodySchema.parse(await request.json());
    if (input.demo && process.env.NODE_ENV !== "production") {
      return Response.json({ pro: true, configured });
    }
    const secret = getProSecret();
    const payload = verifyProToken(input.token, secret ?? "");
    const pro = payload ? await isSubscriptionActive(payload.subscriptionId) : false;
    return Response.json({ pro, configured });
  } catch {
    return Response.json({ pro: false, configured });
  }
}
