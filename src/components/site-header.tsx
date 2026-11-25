"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Crown, Headphones, Mic, Settings2 } from "lucide-react";
import { usePro } from "@/components/app-providers";
import { ThemeToggle } from "@/components/theme-toggle";
import { UsageMeter } from "@/components/usage-meter";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/dashboard", label: "Обучение", icon: BookOpenText },
  { href: "/practice", label: "Практика", icon: Settings2 },
  { href: "/speaking", label: "Speaking", icon: Mic },
  { href: "/listening", label: "Listening", icon: Headphones },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { isPro } = usePro();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <span className="font-heading text-3xl leading-none text-gold">С</span>
          <span className="text-base font-bold tracking-tight">лово</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {links.map(({ href, label, icon: Icon }) => (
            <Button
              key={href}
              render={<Link href={href} />}
              variant={pathname.startsWith(href) ? "secondary" : "ghost"}
              size="sm"
            >
              <Icon className="size-4" />
              {label}
            </Button>
          ))}
        </nav>

        <div className="ml-auto hidden md:block">
          <UsageMeter compact />
        </div>

        <Button
          render={<Link href="/billing" />}
          size="sm"
          variant={isPro ? "secondary" : "default"}
          className="gap-1.5"
        >
          {isPro ? <Crown className="size-4" /> : null}
          {isPro ? "Pro" : "Тарифы"}
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
