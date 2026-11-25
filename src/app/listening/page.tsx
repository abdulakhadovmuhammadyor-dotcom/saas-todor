"use client";

import { useState } from "react";
import Link from "next/link";
import { usePro } from "@/components/app-providers";
import { ListeningPlayer } from "@/components/listening-player";
import { Paywall } from "@/components/paywall";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { levels, topics } from "@/lib/content";
import type { LevelId } from "@/lib/types";

export default function ListeningPage() {
  const { isPro } = usePro();
  const [levelId, setLevelId] = useState<LevelId>("beginner");
  const level = levels.find((item) => item.id === levelId)!;
  const levelTopics = topics.filter((item) => item.levelId === levelId);
  const [topicId, setTopicId] = useState(levelTopics[0]?.id ?? "");
  const topic = levelTopics.find((item) => item.id === topicId) ?? levelTopics[0];

  if (!isPro) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Paywall title="Listening доступен в Pro" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <Button render={<Link href="/dashboard" />} variant="ghost" size="sm">
          К обучению
        </Button>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Listening</h1>
        <p className="mt-2 text-muted-foreground">
          AI подготовит короткий диалог с вопросом — слушайте и выбирайте ответ.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Настройки задания</CardTitle>
          <CardDescription>Уровень и тема влияют на сложность диалога.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {levels.map((item) => (
              <Button
                key={item.id}
                size="sm"
                variant={item.id === levelId ? "default" : "outline"}
                onClick={() => {
                  setLevelId(item.id);
                  const nextTopics = topics.filter((topicItem) => topicItem.levelId === item.id);
                  setTopicId(nextTopics[0]?.id ?? "");
                }}
              >
                {item.cefr}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {levelTopics.map((item) => (
              <Button
                key={item.id}
                size="sm"
                variant={item.id === topic?.id ? "secondary" : "outline"}
                onClick={() => setTopicId(item.id)}
              >
                {item.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <ListeningPlayer
        level={`${level.title} (${level.cefr})`}
        topic={topic?.title ?? "Общая тема"}
      />
    </div>
  );
}
