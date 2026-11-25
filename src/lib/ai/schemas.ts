import { z } from "zod";

export const chatSchema = z.object({
  reply: z.string(),
  followUp: z.string(),
});

export const quizSchema = z.object({
  prompt: z.string(),
  options: z.array(z.string()).min(2).max(6),
  answer: z.string(),
  explanation: z.string(),
  hint: z.string().optional(),
});

export const feedbackSchema = z.object({
  score: z.number().min(0).max(100),
  correct: z.boolean(),
  errors: z.array(
    z.object({
      original: z.string(),
      correction: z.string(),
      explanation: z.string(),
    }),
  ),
  tips: z.array(z.string()),
});

export const pronunciationSchema = z.object({
  transcript: z.string(),
  score: z.number().min(0).max(100),
  words: z.array(
    z.object({
      word: z.string(),
      score: z.number().min(0).max(100),
      note: z.string(),
    }),
  ),
  tips: z.array(z.string()),
});

export const listeningSchema = z.object({
  script: z.string(),
  question: z.string(),
  options: z.array(z.string()).min(2).max(6),
  answer: z.string(),
  translation: z.string(),
});

export type ChatResult = z.infer<typeof chatSchema>;
export type QuizResult = z.infer<typeof quizSchema>;
export type FeedbackResult = z.infer<typeof feedbackSchema>;
export type PronunciationResult = z.infer<typeof pronunciationSchema>;
export type ListeningResult = z.infer<typeof listeningSchema>;
