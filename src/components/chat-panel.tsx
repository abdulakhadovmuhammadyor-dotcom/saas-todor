"use client";

import { useState } from "react";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { ChatResult } from "@/lib/ai/schemas";

interface Message {
  role: "tutor" | "user";
  text: string;
}

export function ChatPanel({ level, topic }: { level: string; topic: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "tutor",
      text: "Привет! Я ваш репетитор. Спросите меня о теме урока или попросите привести пример.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const message = input.trim();
    if (!message || loading) return;
    setMessages((previous) => [...previous, { role: "user", text: message }]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, topic, message }),
      });
      const data = (await response.json()) as ChatResult & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Ошибка");
      setMessages((previous) => [
        ...previous,
        { role: "tutor", text: `${data.reply}\n\n${data.followUp}` },
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось получить ответ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <MessageCircle className="size-5 text-gold" /> Диалог с репетитором
        </CardTitle>
        <CardDescription>Задавайте вопросы по теме «{topic}».</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="max-h-80 min-h-48 flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                message.role === "tutor"
                  ? "border border-border bg-muted/40"
                  : "ml-auto max-w-[85%] bg-primary text-primary-foreground"
              }`}
            >
              {message.text}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" /> Репетитор думает…
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send();
              }
            }}
            placeholder="Напишите вопрос…"
            aria-label="Сообщение репетитору"
            rows={3}
          />
          <Button onClick={send} disabled={!input.trim() || loading} className="w-full">
            <Send className="size-4" /> Отправить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
