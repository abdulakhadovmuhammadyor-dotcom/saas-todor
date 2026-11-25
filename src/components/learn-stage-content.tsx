"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { usePro, useUsage } from "@/components/app-providers";
import { UsageMeter } from "@/components/usage-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLevel, getLessonsByTopic, getTopics } from "@/lib/content";

export function LearnStageContent({ stage }: { stage: string }) {
  const level = getLevel(stage);
  const { isPro } = usePro();
  const { canStart, hydrated } = useUsage();

  if (!level) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Этап не найден</h1>
        <Button render={<Link href="/dashboard" />} className="mt-6">
          Вернуться к обучению
        </Button>
      </div>
    );
  }

  const topics = getTopics(level.id);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <Button render={<Link href="/dashboard" />} variant="ghost" size="sm">
        <ArrowLeft className="size-4" /> Все этапы
      </Button>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="secondary">{level.cefr}</Badge>
          <h1 className="mt-3 font-heading text-5xl font-normal text-gold dark:text-[#d8ae74]">
            {level.title}
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">{level.description}</p>
        </div>
        <div className="w-full max-w-sm">
          <UsageMeter />
        </div>
      </div>

      <div className="space-y-6">
        {topics.map((topic) => {
          const lessons = getLessonsByTopic(topic.id);
          const locked = topic.pro && !isPro;
          return (
            <Card key={topic.id} className={locked ? "border-dashed opacity-80" : ""}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                  {topic.pro ? (
                    <Badge className="bg-gold/15 text-gold hover:bg-gold/20 dark:text-[#d8ae74]">Pro</Badge>
                  ) : (
                    <Badge variant="outline">Free</Badge>
                  )}
                </div>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {lessons.map((lesson) => {
                    const unavailable = locked || !canStart(lesson.id);
                    return unavailable ? (
                      <Button
                        key={lesson.id}
                        variant="outline"
                        className="h-auto justify-start py-4 text-left"
                        disabled={hydrated}
                      >
                        <span className="flex items-center gap-3">
                          <LockKeyhole className="size-4" />
                          <span>
                            <span className="block font-semibold">{lesson.title}</span>
                            <span className="block text-xs font-normal text-muted-foreground">
                              {locked ? "Доступно в Pro" : "Лимит на сегодня исчерпан"}
                            </span>
                          </span>
                        </span>
                      </Button>
                    ) : (
                      <Button
                        key={lesson.id}
                        render={<Link href={`/lesson/${lesson.id}`} />}
                        variant="outline"
                        className="h-auto justify-between py-4 text-left"
                      >
                        <span>
                          <span className="block font-semibold">{lesson.title}</span>
                          <span className="block text-xs font-normal text-muted-foreground">
                            {lesson.description}
                          </span>
                        </span>
                        <ArrowRight className="size-4" />
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
