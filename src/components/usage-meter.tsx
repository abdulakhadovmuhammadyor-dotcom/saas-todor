"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePro, useUsage } from "@/components/app-providers";
import { FREE_DAILY_LESSONS, FREE_DAILY_SECONDS } from "@/lib/constants";

function formatMinutes(seconds: number): string {
  if (!Number.isFinite(seconds)) return "∞";
  return `${Math.ceil(seconds / 60)} мин`;
}

export function UsageMeter({ compact = false }: { compact?: boolean }) {
  const { remainingSeconds, remainingLessons, state, hydrated } = useUsage();
  const { isPro } = usePro();

  if (!hydrated) {
    return <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" aria-hidden />;
  }

  if (isPro) {
    return (
      <Badge className="gap-1.5 bg-gold/15 text-gold hover:bg-gold/20 dark:text-[#d8ae74]">
        <span className="size-1.5 rounded-full bg-current" />
        Pro · безлимит
      </Badge>
    );
  }

  const percent = Math.min(100, ((FREE_DAILY_SECONDS - remainingSeconds) / FREE_DAILY_SECONDS) * 100);

  return (
    <div className={compact ? "w-44" : "w-full max-w-md space-y-2"}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {formatMinutes(remainingSeconds)} · {remainingLessons}/{FREE_DAILY_LESSONS} уроков
        </span>
      </div>
      <Progress value={percent} className="h-1.5" aria-label="Использовано минут практики" />
      {!compact && (
        <p className="text-xs text-muted-foreground">
          Лимит обновится сегодня в 00:00 по вашему времени
        </p>
      )}
      {state.secondsUsed >= FREE_DAILY_SECONDS && (
        <p className="text-xs font-medium text-gold">Минуты закончились — подключите Pro</p>
      )}
    </div>
  );
}
