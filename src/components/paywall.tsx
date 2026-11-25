"use client";

import Link from "next/link";
import { ArrowRight, Crown, LockKeyhole } from "lucide-react";
import { usePro } from "@/components/app-providers";
import { CheckoutButton } from "@/components/checkout-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Paywall({ title = "Эта функция доступна в Pro" }: { title?: string }) {
  const { configured, enableDemo } = usePro();

  return (
    <Card className="mx-auto max-w-2xl border-gold/40 bg-gradient-to-br from-card to-gold/10">
      <CardHeader className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold/15">
          <LockKeyhole className="size-5 text-gold dark:text-[#d8ae74]" />
        </div>
        <CardTitle className="font-heading text-4xl font-normal text-gold dark:text-[#d8ae74]">
          {title}
        </CardTitle>
        <CardDescription>
          Подписка Pro открывает произношение, аудирование, разбор ошибок и безлимитную практику.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <CheckoutButton label="Оформить Pro" />
        {!configured && (
          <button
            type="button"
            onClick={enableDemo}
            className="text-xs text-muted-foreground underline underline-offset-4 hover:text-gold"
          >
            Включить демо-режим Pro
          </button>
        )}
        <Button render={<Link href="/dashboard" />} variant="ghost" size="sm">
          Вернуться к обучению <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function ProBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold dark:text-[#d8ae74]">
      <Crown className="size-3" /> Pro
    </span>
  );
}
