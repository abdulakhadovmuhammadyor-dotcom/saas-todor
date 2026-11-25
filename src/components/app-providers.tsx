"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { FREE_DAILY_LESSONS, FREE_DAILY_SECONDS } from "@/lib/constants";
import { freeLessonIds } from "@/lib/content";
import { clearProToken, getAnonId, getStoredProToken, storeCustomerId, storeProToken } from "@/lib/pro-client";
import {
  applyCompletedLesson,
  applyPracticeSeconds,
  canStartLesson,
  lessonsRemaining,
  normalizeUsage,
  secondsRemaining,
  type UsageState,
} from "@/lib/usage";
import {
  getUsageServerSnapshot,
  getUsageSnapshot,
  subscribeUsage,
  updateUsage,
} from "@/lib/usage-store";
import { useMounted } from "@/lib/use-mounted";

interface ProContextValue {
  isPro: boolean;
  loading: boolean;
  configured: boolean;
  refresh: () => Promise<void>;
  enableDemo: () => void;
}

interface UsageContextValue {
  state: UsageState;
  hydrated: boolean;
  remainingSeconds: number;
  remainingLessons: number;
  setPracticeActive: (active: boolean) => void;
  completeLesson: (lessonId: string) => void;
  canStart: (lessonId: string) => boolean;
}

const ProContext = createContext<ProContextValue | null>(null);
const UsageContext = createContext<UsageContextValue | null>(null);

const DEMO_KEY = "russian-tutor:demo-pro";

export function AppProviders({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const token = getStoredProToken();
      const response = await fetch("/api/stripe/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, demo: window.localStorage.getItem(DEMO_KEY) === "1" }),
      });
      const data = (await response.json()) as { pro?: boolean; configured?: boolean };
      setIsPro(Boolean(data.pro));
      if (typeof data.configured === "boolean") setConfigured(data.configured);
    } catch {
      setIsPro(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0);
    const interval = window.setInterval(() => void refresh(), 5 * 60 * 1000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, [refresh]);

  const enableDemo = useCallback(() => {
    window.localStorage.setItem(DEMO_KEY, "1");
    void refresh();
    toast.success("Демо-режим Pro включён");
  }, [refresh]);

  const proValue = useMemo<ProContextValue>(
    () => ({ isPro, loading, configured, refresh, enableDemo }),
    [isPro, loading, configured, refresh, enableDemo],
  );

  return (
    <ProContext.Provider value={proValue}>
      <UsageProvider isPro={isPro}>{children}</UsageProvider>
    </ProContext.Provider>
  );
}

function UsageProvider({ children, isPro }: { children: ReactNode; isPro: boolean }) {
  const state = useSyncExternalStore(subscribeUsage, getUsageSnapshot, getUsageServerSnapshot);
  const hydrated = useMounted();
  const activeRef = useRef(false);
  const pendingRef = useRef(0);
  const lastTickRef = useRef(0);

  useEffect(() => {
    if (!hydrated) return;
    lastTickRef.current = Date.now();
    const onVisibility = () => {
      lastTickRef.current = Date.now();
      pendingRef.current = 0;
    };
    document.addEventListener("visibilitychange", onVisibility);
    const interval = window.setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;

      const current = getUsageSnapshot();
      const rolled = normalizeUsage(current, new Date());
      if (rolled !== current) {
        pendingRef.current = 0;
        toast.info("Новый день — лимит практики обновлён");
        updateUsage(() => rolled);
        return;
      }
      if (!activeRef.current || document.hidden) return;
      pendingRef.current += Math.max(0, Math.min(elapsed, 2));
      if (pendingRef.current < 1) return;
      const whole = Math.floor(pendingRef.current);
      pendingRef.current -= whole;
      updateUsage((previous) =>
        applyPracticeSeconds(previous, whole, FREE_DAILY_SECONDS, isPro),
      );
    }, 1000);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [hydrated, isPro]);

  const setPracticeActive = useCallback((active: boolean) => {
    activeRef.current = active;
    lastTickRef.current = Date.now();
    pendingRef.current = 0;
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    updateUsage((previous) => applyCompletedLesson(previous, lessonId));
  }, []);

  const canStart = useCallback(
    (lessonId: string) =>
      canStartLesson(
        state,
        lessonId,
        FREE_DAILY_SECONDS,
        FREE_DAILY_LESSONS,
        freeLessonIds,
        isPro,
      ),
    [state, isPro],
  );

  const value = useMemo<UsageContextValue>(
    () => ({
      state,
      hydrated,
      remainingSeconds: secondsRemaining(state, FREE_DAILY_SECONDS, isPro),
      remainingLessons: lessonsRemaining(state, FREE_DAILY_LESSONS, freeLessonIds, isPro),
      setPracticeActive,
      completeLesson,
      canStart,
    }),
    [state, hydrated, isPro, setPracticeActive, completeLesson, canStart],
  );

  return <UsageContext.Provider value={value}>{children}</UsageContext.Provider>;
}

export function usePro(): ProContextValue {
  const context = useContext(ProContext);
  if (!context) throw new Error("usePro must be used inside AppProviders");
  return context;
}

export function useUsage(): UsageContextValue {
  const context = useContext(UsageContext);
  if (!context) throw new Error("useUsage must be used inside AppProviders");
  return context;
}

export { clearProToken, getAnonId, storeCustomerId, storeProToken };
