"use client";

import Link from "next/link";
import { Check, CheckCircle2, Crown, Loader2, XCircle } from "lucide-react";
import { usePro } from "@/components/app-providers";
import {
  CheckoutButton,
  ManageSubscriptionButton,
  RefreshProButton,
} from "@/components/checkout-button";
import { ProBadge } from "@/components/paywall";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const freeFeatures = [
  "10 минут практики в день",
  "5 уроков в день",
  "Базовые темы A1 и B1",
  "Квизы, задачи и грамматика",
];

const proFeatures = [
  "Безлимитная практика",
  "Проверка произношения",
  "Speaking и listening",
  "Разбор ошибок от AI",
  "Все этапы до C2",
];

export function BillingContent({
  canceled = false,
  success = false,
}: {
  canceled?: boolean;
  success?: boolean;
}) {
  const { isPro, loading, configured, enableDemo } = usePro();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <Button render={<Link href="/dashboard" />} variant="ghost" size="sm">
          К обучению
        </Button>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Тарифы и подписка</h1>
        <p className="mt-2 text-muted-foreground">
          Начните бесплатно или откройте все возможности репетитора.
        </p>
      </div>

      {success && (
        <Card className="border-emerald-500/30 bg-emerald-500/10">
          <CardContent className="flex items-center gap-3 py-5 text-sm">
            <CheckCircle2 className="size-5 text-emerald-700 dark:text-emerald-300" />
            <div>
              <p className="font-semibold">Оплата прошла успешно</p>
              <p className="text-muted-foreground">Статус Pro обновлён на этом устройстве.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {canceled && (
        <Card className="border-gold/30 bg-gold/5">
          <CardContent className="flex items-center gap-3 py-5 text-sm">
            <XCircle className="size-5 text-gold" />
            <span>Оплата отменена — ваш текущий тариф не изменился.</span>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Free</CardTitle>
            <CardDescription>Для знакомства с сервисом.</CardDescription>
            <p className="pt-3 text-3xl font-bold">0 ₽</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="space-y-2 text-sm">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" /> {feature}
                </li>
              ))}
            </ul>
            {!isPro && (
              <Button render={<Link href="/dashboard" />} variant="outline" className="w-full">
                Текущий тариф
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-gold/40 bg-gradient-to-br from-card to-gold/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Crown className="size-5 text-gold" /> Pro
              </CardTitle>
              {isPro ? <ProBadge /> : null}
            </div>
            <CardDescription>Для уверенной разговорной речи.</CardDescription>
            <p className="pt-3 text-3xl font-bold">Подписка</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="space-y-2 text-sm">
              {proFeatures.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" /> {feature}
                </li>
              ))}
            </ul>
            {loading ? (
              <Button disabled className="w-full">
                <Loader2 className="size-4 animate-spin" /> Проверяем статус…
              </Button>
            ) : isPro ? (
              <ManageSubscriptionButton />
            ) : (
              <>
                <CheckoutButton className="w-full" />
                {!configured && (
                  <Button variant="outline" className="w-full" onClick={enableDemo}>
                    Включить демо-режим Pro
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <p className="font-semibold">Статус подписки</p>
            <p className="text-sm text-muted-foreground">
              {configured
                ? "Проверяется сервером через Stripe каждые 5 минут."
                : "Stripe не настроен — доступен демо-режим для разработки."}
            </p>
          </div>
          <RefreshProButton />
        </CardContent>
      </Card>
    </div>
  );
}
