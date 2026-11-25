"use client";

import { useState } from "react";
import { BookOpenText, MessageCircle } from "lucide-react";
import { ChatPanel } from "@/components/chat-panel";
import { UsageMeter } from "@/components/usage-meter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { levels } from "@/lib/content";
import type { LevelId } from "@/lib/types";

export default function PracticePage() {
  const [levelId, setLevelId] = useState<LevelId>("beginner");
  const level = levels.find((item) => item.id === levelId)!;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold dark:text-[#d8ae74]">
            Свободная практика
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Практикуйтесь в диалоге</h1>
          <p className="mt-2 text-muted-foreground">
            Выберите уровень и общайтесь с репетитором на любую тему.
          </p>
        </div>
        <div className="w-full max-w-sm">
          <UsageMeter />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {levels.map((item) => (
          <Button
            key={item.id}
            variant={item.id === levelId ? "default" : "outline"}
            onClick={() => setLevelId(item.id)}
          >
            {item.cefr} · {item.title}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpenText className="size-5 text-gold" /> Уровень {level.cefr}
            </CardTitle>
            <CardDescription>{level.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <span className="font-semibold">Подсказка:</span> начните с фразы «Расскажите мне о …»
              или попросите исправить ваше предложение.
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="size-4" /> Ответы репетитора адаптируются под уровень.
            </p>
          </CardContent>
        </Card>
        <ChatPanel level={`${level.title} (${level.cefr})`} topic="Свободная практика" />
      </div>
    </div>
  );
}
