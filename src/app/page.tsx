import Link from "next/link";
import { ArrowRight, BookOpenCheck, Headphones, Mic2, SpellCheck2 } from "lucide-react";
import { PricingSection } from "@/components/pricing-section";
import { UsageMeter } from "@/components/usage-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { levels } from "@/lib/content";

const features = [
  { icon: BookOpenCheck, title: "Грамматика и правописание", text: "Объяснения по уровню, а не готовые ответы." },
  { icon: SpellCheck2, title: "Квизы и задачи", text: "Короткие упражнения, которые закрепляют тему." },
  { icon: Mic2, title: "Speaking в Pro", text: "Произношение оценивает AI по вашему голосу." },
  { icon: Headphones, title: "Listening в Pro", text: "Диалоги и вопросы на восприятие русской речи." },
];

export default function HomePage() {
  return (
    <div className="grain">
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 pt-20 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:pt-28">
        <div className="space-y-8">
          <Badge variant="outline" className="border-gold/40 text-gold dark:text-[#d8ae74]">
            Персональный AI-репетитор
          </Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              Русский язык —
              <span className="block font-heading text-5xl font-normal text-gold sm:text-7xl dark:text-[#d8ae74]">
                по-вашему расписанию
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Четыре этапа обучения, короткие ежедневные практики и живой диалог с AI.
              Начните с 10 минут в день и переходите к разговорной речи когда будете готовы.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="/dashboard" />} size="lg">
              Начать практику <ArrowRight className="size-4" />
            </Button>
            <Button render={<Link href="#tariffs" />} size="lg" variant="outline">
              Сравнить тарифы
            </Button>
          </div>
          <div className="max-w-md rounded-xl border border-border bg-card/80 p-5 backdrop-blur">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Ваш лимит сегодня
            </p>
            <UsageMeter />
          </div>
        </div>

        <Card className="relative overflow-hidden border-gold/30 bg-card/90 shadow-xl backdrop-blur">
          <div className="absolute -right-12 -top-12 size-48 rounded-full bg-gold/10 blur-3xl" />
          <CardHeader className="relative">
            <CardTitle className="font-heading text-4xl font-normal text-gold dark:text-[#d8ae74]">
              Четыре ступени
            </CardTitle>
            <CardDescription>От первых слов до уверенной речи.</CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-3">
            {levels.map((level) => (
              <div
                key={level.id}
                className="flex items-center gap-4 rounded-lg border border-border/70 bg-background/60 px-4 py-3"
              >
                <span className="flex size-9 items-center justify-center rounded-full border border-gold/40 text-sm font-bold text-gold dark:text-[#d8ae74]">
                  {level.order}
                </span>
                <div>
                  <p className="font-semibold">{level.title}</p>
                  <p className="text-xs text-muted-foreground">{level.cefr} · {level.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="border-border/70 bg-card/70">
              <CardHeader>
                <Icon className="size-6 text-gold" />
                <CardTitle className="pt-3 text-base">{title}</CardTitle>
                <CardDescription>{text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <PricingSection />

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Слово · AI-репетитор русского языка
      </footer>
    </div>
  );
}
