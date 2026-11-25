"use client";

import { useState } from "react";
import Link from "next/link";
import { usePro } from "@/components/app-providers";
import { Paywall } from "@/components/paywall";
import { SpeakingRecorder } from "@/components/speaking-recorder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const presets = [
  "Здравствуйте, меня зовут Анна.",
  "Сейчас семь тридцать.",
  "Я обычно встаю в семь утра и делаю зарядку.",
];

export default function SpeakingPage() {
  const { isPro } = usePro();
  const [phrase, setPhrase] = useState(presets[0]);

  if (!isPro) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Paywall title="Speaking доступен в Pro" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <Button render={<Link href="/dashboard" />} variant="ghost" size="sm">
          К обучению
        </Button>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Speaking</h1>
        <p className="mt-2 text-muted-foreground">
          Произносите фразы вслух — AI оценит отдельные слова и даст советы.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Ваша фраза</CardTitle>
          <CardDescription>Выберите готовую фразу или напишите свою.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {presets.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={item === phrase ? "default" : "outline"}
                onClick={() => setPhrase(item)}
              >
                {item}
              </Button>
            ))}
          </div>
          <Input
            value={phrase}
            onChange={(event) => setPhrase(event.target.value)}
            placeholder="Фраза на русском…"
            aria-label="Фраза для произношения"
          />
        </CardContent>
      </Card>

      <SpeakingRecorder targetPhrase={phrase} />
    </div>
  );
}
