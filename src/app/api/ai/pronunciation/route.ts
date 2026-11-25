import { z } from "zod";
import { generateStructured, hasGeminiConfig } from "@/lib/ai/client";
import { mockPronunciation } from "@/lib/ai/mock";
import { pronunciationPrompt } from "@/lib/ai/prompts";
import { pronunciationSchema } from "@/lib/ai/schemas";
import { isProRequest } from "@/lib/require-pro";

const bodySchema = z.object({
  targetPhrase: z.string().min(1).max(500),
  audio: z.string().min(16).max(8 * 1024 * 1024),
  mimeType: z.string().min(1).max(80),
});

export async function POST(request: Request) {
  if (!(await isProRequest(request))) {
    return Response.json({ error: "Проверка произношения доступна в Pro" }, { status: 403 });
  }
  try {
    const input = bodySchema.parse(await request.json());
    const result = hasGeminiConfig()
      ? await generateStructured(pronunciationSchema, {
          system: "Ты репетитор русского языка. Оценивай произношение доброжелательно и точно.",
          prompt: pronunciationPrompt(input.targetPhrase),
          audio: { mimeType: input.mimeType, data: input.audio },
        })
      : mockPronunciation(input.targetPhrase);
    return Response.json(result);
  } catch {
    return Response.json({ error: "Не удалось оценить произношение" }, { status: 400 });
  }
}
