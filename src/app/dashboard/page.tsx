"use client";

import Link from "next/link";
import { ArrowRight, Crown, LockKeyhole } from "lucide-react";
import { usePro, useUsage } from "@/components/app-providers";
import { UsageMeter } from "@/components/usage-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getTopics, lessons, levels } from "@/lib/content";

export default function DashboardPage() {
  const { isPro } = usePro();
  const { state, hydrated } = useUsage();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold dark:text-[#d8ae74]">
            Обучение
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">С чего начнём сегодня?</h1>
          <p className="mt-2 text-muted-foreground">
            Выберите этап — и AI-репетитор подстроится под ваш уровень.
          </p>
        </div>
        <div className="w-full max-w-md">
          <UsageMeter />
        </div>
      </div>

      {!isPro && (
        <Card className="border-gold/40 bg-gradient-to-r from-card to-gold/10">
          <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Crown className="mt-0.5 size-5 shrink-0 text-gold" />
              <div>
                <p className="font-semibold">Хотите говорить свободно?</p>
                <p className="text-sm text-muted-foreground">
                  Pro открывает произношение, аудирование и разбор ошибок.
                </p>
              </div>
            </div>
            <Button render={<Link href="/billing" />}>Узнать о Pro</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {levels.map((level) => {
          const locked = !isPro && (level.id === "advanced" || level.id === "expert");
          const levelLessons = lessons.filter((lesson) => lesson.levelId === level.id);
          const completed = hydrated
            ? levelLessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length
            : 0;
          const percent = levelLessons.length ? (completed / levelLessons.length) * 100 : 0;

          return (
            <Card
              key={level.id}
              className={`group relative flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg ${
                locked ? "opacity-80" : "border-border"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{level.cefr}</Badge>
                  {locked ? (
                    <LockKeyhole className="size-4 text-muted-foreground" />
                  ) : (
                    <span className="font-heading text-3xl text-gold dark:text-[#d8ae74]">
                      {level.order}
                    </span>
                  )}
                </div>
                <CardTitle className="pt-3 text-xl">{level.title}</CardTitle>
                <CardDescription>{level.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{completed} из {levelLessons.length} уроков</span>
                    <span>{Math.round(percent)}%</span>
                  </div>
                  <Progress value={percent} className="h-1.5" />
                </div>
                <Button
                  render={<Link href={locked ? "/billing" : `/learn/${level.id}`} />}
                  variant={locked ? "outline" : "default"}
                  className="w-full"
                >
                  {locked ? "Открыть в Pro" : "Выбрать тему"}
                  <ArrowRight className="size-4" />
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {getTopics(level.id).length} тем
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
