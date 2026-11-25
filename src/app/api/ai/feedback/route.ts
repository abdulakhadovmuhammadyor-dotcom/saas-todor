import { z } from "zod";
import { generateStructured, hasGeminiConfig } from "@/lib/ai/client";
import { mockFeedback } from "@/lib/ai/mock";
import { feedbackPrompt, TUTOR_SYSTEM } from "@/lib/ai/prompts";
import { feedbackSchema } from "@/lib/ai/schemas";
import { isProRequest } from "@/lib/require-pro";

const bodySchema = z.object({
  level: z.string().min(1).max(80),
  prompt: z.string().min(1).max(500),
  answer: z.string().min(1).max(3000),
});

export async function POST(request: Request) {
  if (!(await isProRequest(request))) {
    return Response.json({ error: "Разбор ошибок доступен в Pro" }, { status: 403 });
  }
  try {
    const input = bodySchema.parse(await request.json());
    const result = hasGeminiConfig()
      ? await generateStructured(feedbackSchema, {
          system: TUTOR_SYSTEM,
          prompt: feedbackPrompt(input.level, input.prompt, input.answer),
        })
      : mockFeedback(input.answer);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Не удалось проверить ответ" }, { status: 400 });
  }
}
