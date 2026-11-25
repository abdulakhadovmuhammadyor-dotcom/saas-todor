"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getAnonId } from "@/lib/pro-client";

export function CheckoutButton({
  label = "Перейти на Pro",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anonId: getAnonId() }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Ошибка оплаты");
      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось открыть оплату");
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className={className} size="lg">
      {loading ? "Открываем оплату…" : label}
    </Button>
  );
}

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  async function handlePortal() {
    setLoading(true);
    try {
      const token = window.localStorage.getItem("russian-tutor:pro:v1");
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error ?? "Ошибка");
      window.location.href = data.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось открыть управление");
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={handlePortal} disabled={loading}>
      {loading ? "Открываем…" : "Управление подпиской"}
    </Button>
  );
}

export function RefreshProButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 300));
        router.refresh();
        window.location.reload();
      }}
    >
      {loading ? "Проверяем…" : "Проверить статус"}
    </Button>
  );
}
