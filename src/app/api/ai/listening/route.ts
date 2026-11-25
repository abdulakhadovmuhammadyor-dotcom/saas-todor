import { z } from "zod";
import { generateStructured, hasGeminiConfig } from "@/lib/ai/client";
import { mockListening } from "@/lib/ai/mock";
import { listeningPrompt, TUTOR_SYSTEM } from "@/lib/ai/prompts";
import { listeningSchema } from "@/lib/ai/schemas";
import { isProRequest } from "@/lib/require-pro";

const bodySchema = z.object({
  level: z.string().min(1).max(80),
  topic: z.string().min(1).max(160),
});

export async function POST(request: Request) {
  if (!(await isProRequest(request))) {
    return Response.json({ error: "Аудирование доступно в Pro" }, { status: 403 });
  }
  try {
    const input = bodySchema.parse(await request.json());
    const result = hasGeminiConfig()
      ? await generateStructured(listeningSchema, {
          system: TUTOR_SYSTEM,
          prompt: listeningPrompt(input.level, input.topic),
        })
      : mockListening(input.topic);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Не удалось создать задание на аудирование" }, { status: 400 });
  }
}
