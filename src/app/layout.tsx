import { Suspense } from "react";
import type { Metadata } from "next";
import { AppProviders } from "@/components/app-providers";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { greatVibes, lineSeed } from "@/lib/fonts";
import "./globals.css";

function HeaderFallback() {
  return (
    <header className="border-b bg-background/95">
      <div className="mx-auto h-16 max-w-7xl px-4 sm:px-6 lg:px-8" />
    </header>
  );
}

export const metadata: Metadata = {
  title: "Слово — персональный AI-репетитор русского языка",
  description:
    "Практика русского языка с AI-репетитором: грамматика, правописание, квизы, speaking и listening.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${greatVibes.variable} ${lineSeed.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <AppProviders>
            <Suspense fallback={<HeaderFallback />}>
              <SiteHeader />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Toaster position="top-center" richColors />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
