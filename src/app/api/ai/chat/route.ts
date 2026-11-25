import { z } from "zod";
import { generateStructured, hasGeminiConfig } from "@/lib/ai/client";
import { mockChat } from "@/lib/ai/mock";
import { chatPrompt, TUTOR_SYSTEM } from "@/lib/ai/prompts";
import { chatSchema } from "@/lib/ai/schemas";

const bodySchema = z.object({
  level: z.string().min(1).max(80),
  topic: z.string().min(1).max(160),
  message: z.string().min(1).max(2000),
});

export async function POST(request: Request) {
  try {
    const input = bodySchema.parse(await request.json());
    const result = hasGeminiConfig()
      ? await generateStructured(chatSchema, {
          system: TUTOR_SYSTEM,
          prompt: chatPrompt(input.level, input.topic, input.message),
        })
      : mockChat(input.level, input.message);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Не удалось получить ответ репетитора" }, { status: 400 });
  }
}
