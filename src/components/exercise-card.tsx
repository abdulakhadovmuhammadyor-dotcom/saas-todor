"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { usePro } from "@/components/app-providers";
import { ProBadge } from "@/components/paywall";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { proHeaders } from "@/lib/pro-client";
import type { FeedbackResult } from "@/lib/ai/schemas";
import type { Exercise, ExerciseKind } from "@/lib/types";

const kindLabels: Record<ExerciseKind, string> = {
  quiz: "Квиз",
  task: "Задача",
  grammar: "Грамматика",
  spelling: "Правописание",
  speaking: "Произношение",
  listening: "Аудирование",
  feedback: "Разбор ошибок",
};

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[.,!?;:«»"()]/g, "")
    .replace(/\s+/g, " ");
}

export function ExerciseCard({
  exercise,
  level,
  onAnswer,
}: {
  exercise: Exercise;
  level: string;
  onAnswer: (correct: boolean) => void;
}) {
  const { isPro } = usePro();
  const [selected, setSelected] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    const answer = exercise.options ? selected : text.trim();
    if (!answer) {
      toast.error("Выберите или введите ответ");
      return;
    }
    setLoading(true);
    const correct = normalize(answer) === normalize(exercise.answer ?? "");
    setResult({ correct, explanation: exercise.explanation ?? "" });
    onAnswer(correct);

    if (isPro && !exercise.options) {
      try {
        const response = await fetch("/api/ai/feedback", {
          method: "POST",
          headers: proHeaders(),
          body: JSON.stringify({ level, prompt: exercise.prompt, answer }),
        });
        if (response.ok) setFeedback((await response.json()) as FeedbackResult);
      } catch {
        toast.error("Не удалось получить разбор ошибок");
      }
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary">{kindLabels[exercise.kind]}</Badge>
          {exercise.kind === "feedback" && <ProBadge />}
        </div>
        <CardTitle className="text-xl">{exercise.prompt}</CardTitle>
        <CardDescription>
          {exercise.options ? "Выберите один вариант." : "Напишите ответ своими словами."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {exercise.options ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {exercise.options.map((option) => (
              <Button
                key={option}
                type="button"
                variant={selected === option ? "default" : "outline"}
                className="h-auto justify-start py-3 text-left font-normal"
                onClick={() => {
                  setSelected(option);
                  setResult(null);
                  setFeedback(null);
                }}
              >
                {option}
              </Button>
            ))}
          </div>
        ) : (
          <Input
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setResult(null);
              setFeedback(null);
            }}
            placeholder="Ваш ответ…"
            aria-label="Ваш ответ"
          />
        )}

        {exercise.hint && !result && (
          <p className="text-xs text-muted-foreground">Подсказка: {exercise.hint}</p>
        )}

        {!result && (
          <Button onClick={check} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Проверить
          </Button>
        )}

        {result && (
          <div
            className={`flex gap-3 rounded-lg border p-4 text-sm ${
              result.correct
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                : "border-destructive/30 bg-destructive/10"
            }`}
          >
            {result.correct ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
            )}
            <div>
              <p className="font-semibold">{result.correct ? "Верно!" : "Пока не совсем так"}</p>
              <p className="mt-1 opacity-90">
                {result.explanation || `Правильный ответ: ${exercise.answer}`}
              </p>
            </div>
          </div>
        )}

        {feedback && (
          <div className="rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm">
            <div className="mb-2 flex items-center gap-2">
              <ProBadge />
              <span className="font-semibold">Разбор от AI: {feedback.score}/100</span>
            </div>
            {feedback.errors.map((error, index) => (
              <p key={index} className="mb-1">
                <span className="text-muted-foreground line-through">{error.original}</span> →{" "}
                <span className="font-medium">{error.correction}</span> — {error.explanation}
              </p>
            ))}
            {feedback.tips.map((tip, index) => (
              <p key={index} className="mt-1 text-muted-foreground">• {tip}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
