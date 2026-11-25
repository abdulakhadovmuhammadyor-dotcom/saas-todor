"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Crown, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { usePro, useUsage } from "@/components/app-providers";
import { ChatPanel } from "@/components/chat-panel";
import { ExerciseCard } from "@/components/exercise-card";
import { ListeningPlayer } from "@/components/listening-player";
import { Paywall } from "@/components/paywall";
import { SpeakingRecorder } from "@/components/speaking-recorder";
import { UsageMeter } from "@/components/usage-meter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { QuizResult } from "@/lib/ai/schemas";
import { getLesson, getLevel, getTopics } from "@/lib/content";
import { proHeaders } from "@/lib/pro-client";
import type { Exercise } from "@/lib/types";

export function LessonContent({ id }: { id: string }) {
  const lesson = getLesson(id);
  const router = useRouter();
  const { isPro } = usePro();
  const { setPracticeActive, completeLesson } = useUsage();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [generated, setGenerated] = useState<Exercise[]>([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    setPracticeActive(true);
    return () => setPracticeActive(false);
  }, [setPracticeActive]);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Урок не найден</h1>
        <Button render={<Link href="/dashboard" />} className="mt-6">
          Вернуться к обучению
        </Button>
      </div>
    );
  }

  if (lesson.pro && !isPro) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Paywall title={`Урок «${lesson.title}» доступен в Pro`} />
      </div>
    );
  }

  const level = getLevel(lesson.levelId);
  const topic = getTopics(lesson.levelId).find((item) => item.id === lesson.topicId);
  const exercises = [...lesson.exercises, ...generated];
  const exercise = exercises[current];
  const answered = Object.keys(answers).length;
  const percent = exercises.length ? (current / exercises.length) * 100 : 0;

  async function generateExercise() {
    if (!lesson || !level || !topic) return;
    setGenerating(true);
    try {
      const response = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: proHeaders(),
        body: JSON.stringify({
          levelId: lesson.levelId,
          level: `${level.title} (${level.cefr})`,
          topic: topic.title,
          kind: exercise?.kind ?? "quiz",
          prompt: exercise?.prompt ?? lesson.title,
        }),
      });
      const data = (await response.json()) as QuizResult & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Ошибка");
      const next: Exercise = {
        id: `ai-${Date.now()}`,
        kind: "quiz",
        prompt: data.prompt,
        options: data.options,
        answer: data.answer,
        explanation: data.explanation,
        hint: data.hint,
      };
      setGenerated((previous) => [...previous, next]);
      setCurrent(exercises.length);
      toast.success("Добавлено упражнение от AI");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось создать упражнение");
    } finally {
      setGenerating(false);
    }
  }

  function finish() {
    completeLesson(lesson!.id);
    toast.success("Урок завершён — прогресс сохранён");
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Button render={<Link href={`/learn/${lesson.levelId}`} />} variant="ghost" size="sm">
            <ArrowLeft className="size-4" /> К темам
          </Button>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{lesson.title}</h1>
          <p className="text-sm text-muted-foreground">{lesson.description}</p>
        </div>
        <div className="w-full max-w-sm">
          <UsageMeter />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Упражнение {current + 1} из {exercises.length}</span>
          <span>{answered} верных ответов</span>
        </div>
        <Progress value={percent} className="h-2" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          {exercise && (
            <>
              {(exercise.kind === "speaking" || exercise.kind === "listening") && !isPro ? (
                <Card className="border-gold/30 bg-gold/5">
                  <CardContent className="flex flex-col items-start gap-3 py-6">
                    <Crown className="size-6 text-gold" />
                    <p className="font-semibold">Это упражнение доступно в Pro</p>
                    <Button render={<Link href="/billing" />}>Открыть Pro</Button>
                  </CardContent>
                </Card>
              ) : exercise.kind === "speaking" ? (
                <SpeakingRecorder targetPhrase={exercise.targetPhrase ?? exercise.prompt} />
              ) : exercise.kind === "listening" ? (
                <ListeningPlayer
                  level={`${level?.title ?? ""} (${level?.cefr ?? ""})`}
                  topic={topic?.title ?? lesson.title}
                />
              ) : (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  level={`${level?.title ?? ""} (${level?.cefr ?? ""})`}
                  onAnswer={(correct) =>
                    setAnswers((previous) => ({ ...previous, [exercise.id]: correct }))
                  }
                />
              )}
            </>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrent((value) => Math.max(0, value - 1))}
              disabled={current === 0}
            >
              Назад
            </Button>
            {current < exercises.length - 1 ? (
              <Button onClick={() => setCurrent((value) => value + 1)}>
                Дальше <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button onClick={finish}>
                <CheckCircle2 className="size-4" /> Завершить урок
              </Button>
            )}
            <Button variant="ghost" onClick={generateExercise} disabled={generating}>
              {generating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Ещё упражнение
            </Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <ChatPanel
            level={`${level?.title ?? ""} (${level?.cefr ?? ""})`}
            topic={topic?.title ?? lesson.title}
          />
        </div>
      </div>
    </div>
  );
}
