"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { usePro } from "@/components/app-providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnonId, storeCustomerId, storeProToken } from "@/lib/pro-client";

export function SuccessHandler({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { refresh } = usePro();
  const [status, setStatus] = useState<"pending" | "done" | "error">("pending");
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function verify() {
      if (!sessionId) {
        setError("Сессия оплаты не найдена");
        setStatus("error");
        return;
      }
      try {
        const response = await fetch("/api/stripe/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, anonId: getAnonId() }),
        });
        const data = (await response.json()) as {
          token?: string;
          customerId?: string;
          error?: string;
        };
        if (!response.ok || !data.token || !data.customerId) {
          throw new Error(data.error ?? "Не удалось подтвердить оплату");
        }
        storeProToken(data.token);
        storeCustomerId(data.customerId);
        await refresh();
        setStatus("done");
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Не удалось подтвердить оплату");
        setStatus("error");
      }
    }

    void verify();
  }, [sessionId, refresh]);

  useEffect(() => {
    if (status !== "done") return;
    const timeout = window.setTimeout(() => router.push("/billing?success=1"), 1200);
    return () => window.clearTimeout(timeout);
  }, [status, router]);

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader className="text-center">
        {status === "pending" ? (
          <Loader2 className="mx-auto size-8 animate-spin text-gold" />
        ) : status === "done" ? (
          <CheckCircle2 className="mx-auto size-8 text-emerald-600" />
        ) : (
          <XCircle className="mx-auto size-8 text-destructive" />
        )}
        <CardTitle className="text-2xl">
          {status === "pending"
            ? "Подтверждаем оплату…"
            : status === "done"
              ? "Готово!"
              : "Не удалось подтвердить"}
        </CardTitle>
        <CardDescription>
          {status === "pending"
            ? "Проверяем подписку в Stripe и сохраняем доступ на этом устройстве."
            : status === "done"
              ? "Сейчас вернём вас к тарифам."
              : error}
        </CardDescription>
      </CardHeader>
      {status === "error" && (
        <CardContent className="flex justify-center">
          <Button render={<Link href="/billing" />}>Вернуться к тарифам</Button>
        </CardContent>
      )}
    </Card>
  );
}
