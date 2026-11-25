import { z } from "zod";
import { generateStructured, hasGeminiConfig } from "@/lib/ai/client";
import { mockQuiz } from "@/lib/ai/mock";
import { quizPrompt, TUTOR_SYSTEM } from "@/lib/ai/prompts";
import { quizSchema } from "@/lib/ai/schemas";
import { isProRequest } from "@/lib/require-pro";

const bodySchema = z.object({
  levelId: z.string().min(1).max(40),
  level: z.string().min(1).max(80),
  topic: z.string().min(1).max(160),
  kind: z.string().min(1).max(40),
  prompt: z.string().min(1).max(500),
});

export async function POST(request: Request) {
  try {
    const input = bodySchema.parse(await request.json());
    if (["advanced", "expert"].includes(input.levelId) && !(await isProRequest(request))) {
      return Response.json({ error: "Этот уровень доступен в Pro" }, { status: 403 });
    }
    const result = hasGeminiConfig()
      ? await generateStructured(quizSchema, {
          system: TUTOR_SYSTEM,
          prompt: quizPrompt(input.level, input.topic, input.kind, input.prompt),
        })
      : mockQuiz(input.topic, input.kind);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Не удалось создать упражнение" }, { status: 400 });
  }
}
