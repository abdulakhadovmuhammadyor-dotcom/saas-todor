import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { MODEL_ID } from "@/lib/constants";

export interface GenerationOptions {
  system: string;
  prompt: string;
  audio?: { mimeType: string; data: string };
}

export function hasGeminiConfig(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export async function generateStructured<T>(
  schema: z.ZodType<T>,
  options: GenerationOptions,
): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const client = new GoogleGenAI({ apiKey });
  const contents = options.audio
    ? [
        {
          parts: [
            { text: options.prompt },
            { inlineData: options.audio },
          ],
        },
      ]
    : options.prompt;

  const response = await client.models.generateContent({
    model: MODEL_ID,
    contents,
    config: {
      systemInstruction: options.system,
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(schema),
      temperature: 0.4,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty response from Gemini");
  return schema.parse(JSON.parse(text));
}
