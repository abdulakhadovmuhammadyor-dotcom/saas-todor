"use client";

import { useRef, useState } from "react";
import { Loader2,Mic, Square, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PronunciationResult } from "@/lib/ai/schemas";
import { proHeaders } from "@/lib/pro-client";

export function SpeakingRecorder({ targetPhrase }: { targetPhrase: string }) {
  const [recording, setRecording] = useState(false);
  const [audio, setAudio] = useState<Blob | null>(null);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  function speak() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Синтез речи недоступен в этом браузере");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(targetPhrase);
    utterance.lang = "ru-RU";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  async function startRecording() {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      toast.error("Запись аудио недоступна в этом браузере");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        setAudio(new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" }));
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      setRecording(true);
      setResult(null);
    } catch {
      toast.error("Не удалось получить доступ к микрофону");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  async function evaluate() {
    if (!audio) return;
    setLoading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("read failed"));
        reader.readAsDataURL(audio);
      });
      const response = await fetch("/api/ai/pronunciation", {
        method: "POST",
        headers: proHeaders(),
        body: JSON.stringify({
          targetPhrase,
          audio: dataUrl.split(",")[1] ?? "",
          mimeType: audio.type || "audio/webm",
        }),
      });
      const data = (await response.json()) as PronunciationResult & { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Ошибка оценки");
      setResult(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось оценить речь");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-gold/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Mic className="size-5 text-gold" /> Произношение
          </CardTitle>
          <Badge className="bg-gold/15 text-gold hover:bg-gold/20 dark:text-[#d8ae74]">Pro</Badge>
        </div>
        <CardDescription>Прослушайте фразу, запишите своё произношение и получите оценку.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <blockquote className="rounded-lg border border-border bg-muted/40 p-4 text-lg">«{targetPhrase}»</blockquote>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={speak}>
            <Volume2 className="size-4" /> Послушать
          </Button>
          {!recording ? (
            <Button onClick={startRecording}>
              <Mic className="size-4" /> Записать
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopRecording}>
              <Square className="size-4" /> Остановить
            </Button>
          )}
          <Button variant="secondary" onClick={evaluate} disabled={!audio || loading || recording}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Оценить
          </Button>
        </div>

        {result && (
          <div className="space-y-3 rounded-lg border border-gold/30 bg-gold/5 p-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Оценка: {result.score}/100</p>
              <span className="text-xs text-muted-foreground">Распознано: {result.transcript}</span>
            </div>
            <Progress value={result.score} className="h-2" />
            <div className="space-y-2 text-sm">
              {result.words.map((word, index) => (
                <div key={index} className="flex justify-between gap-3">
                  <span className="font-medium">{word.word}</span>
                  <span className="text-muted-foreground">{word.score} · {word.note}</span>
                </div>
              ))}
            </div>
            {result.tips.map((tip, index) => (
              <p key={index} className="text-sm text-muted-foreground">• {tip}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
