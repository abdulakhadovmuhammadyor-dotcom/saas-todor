"use client";

import Link from "next/link";
import { Check, Crown, Infinity as InfinityIcon, Sparkles } from "lucide-react";
import { usePro } from "@/components/app-providers";
import { CheckoutButton } from "@/components/checkout-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const freeFeatures = [
  "10 минут практики каждый день",
  "5 уроков в день, сброс в полночь",
  "Базовые темы: начальный и средний",
  "Квизы, задачи, грамматика и правописание",
];

const proFeatures = [
  "Неограниченное время практики",
  "Проверка произношения по аудио",
  "Speaking и listening с AI",
  "Подробный разбор ошибок",
  "Все этапы, включая эксперт",
];

export function PricingSection() {
  const { isPro, configured, enableDemo } = usePro();

  return (
    <section id="tariffs" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Тарифы</p>
        <h2 className="mt-3 font-heading text-4xl text-brown sm:text-5xl dark:text-[#d8ae74]">
          Выберите свой ритм
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="relative overflow-hidden border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="size-5 text-gold" /> Free
            </CardTitle>
            <CardDescription>Попробуйте язык в деле — каждый день понемногу.</CardDescription>
            <p className="pt-4 text-3xl font-bold">0 ₽</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="space-y-3 text-sm">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button render={<Link href="/dashboard" />} variant="outline" size="lg" className="w-full">
              Начать бесплатно
            </Button>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-gold/40 bg-gradient-to-br from-card via-card to-gold/10 shadow-lg">
          <div className="absolute right-4 top-4">
            <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold dark:text-[#d8ae74]">
              РЕКОМЕНДУЕМ
            </span>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Crown className="size-5 text-gold" /> Pro
            </CardTitle>
            <CardDescription>Говорите, слушайте и разбирайте ошибки без ограничений.</CardDescription>
            <p className="flex items-center gap-2 pt-4 text-3xl font-bold">
              Подписка <InfinityIcon className="size-5 text-gold" />
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="space-y-3 text-sm">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            {isPro ? (
              <Button render={<Link href="/dashboard" />} size="lg" className="w-full">
                Продолжить обучение
              </Button>
            ) : (
              <CheckoutButton className="w-full" />
            )}
            {!configured && (
              <button
                type="button"
                onClick={enableDemo}
                className="w-full text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-gold"
              >
                Включить демо-режим Pro (без ключей Stripe)
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
