"use client";

import { useState } from "react";
import { Headphones, Loader2, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ListeningResult } from "@/lib/ai/schemas";
import { proHeaders } from "@/lib/pro-client";

export function ListeningPlayer({ level, topic }: { level: string; topic: string }) {
  const [data, setData] = useState<ListeningResult | null>(null);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/listening", {
        method: "POST",
        headers: proHeaders(),
        body: JSON.stringify({ level, topic }),
      });
      const result = (await response.json()) as ListeningResult & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Ошибка");
      setData(result);
      setSelected("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось создать задание");
    } finally {
      setLoading(false);
    }
  }

  function play() {
    if (!data || typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Синтез речи недоступен в этом браузере");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(data.script);
    utterance.lang = "ru-RU";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <Card className="border-gold/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Headphones className="size-5 text-gold" /> Аудирование
          </CardTitle>
          <Badge className="bg-gold/15 text-gold hover:bg-gold/20 dark:text-[#d8ae74]">Pro</Badge>
        </div>
        <CardDescription>AI подготовит короткий диалог и вопрос по теме «{topic}».</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={generate} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {data ? "Новое задание" : "Создать задание"}
        </Button>

        {data && (
          <>
            <div className="rounded-lg border border-border bg-muted/40 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Текст для прослушивания
                </span>
                <Button variant="ghost" size="sm" onClick={play}>
                  <Volume2 className="size-4" /> Слушать
                </Button>
              </div>
              <p className="text-sm leading-relaxed">{data.script}</p>
              <details className="mt-3 text-xs text-muted-foreground">
                <summary className="cursor-pointer">Перевод</summary>
                <p className="mt-1">{data.translation}</p>
              </details>
            </div>

            <div className="space-y-3">
              <p className="font-semibold">{data.question}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {data.options.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={selected === option ? "default" : "outline"}
                    className="h-auto justify-start py-3 text-left font-normal"
                    onClick={() => setSelected(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {selected && (
                <p className="text-sm">
                  {selected === data.answer ? (
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300">Верно!</span>
                  ) : (
                    <span>Правильный ответ: {data.answer}</span>
                  )}
                </p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
