"use client";

import { USAGE_STORAGE_KEY } from "@/lib/constants";
import { freshUsage, normalizeUsage, type UsageState } from "@/lib/usage";

const serverSnapshot = freshUsage(new Date(0));
const listeners = new Set<() => void>();
let snapshot: UsageState | null = null;

function readFromStorage(): UsageState {
  if (typeof window === "undefined") return serverSnapshot;
  try {
    const stored = window.localStorage.getItem(USAGE_STORAGE_KEY);
    return stored ? normalizeUsage(JSON.parse(stored), new Date()) : freshUsage();
  } catch {
    return freshUsage();
  }
}

export function subscribeUsage(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== USAGE_STORAGE_KEY) return;
    snapshot = readFromStorage();
    listener();
  };
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}

export function getUsageSnapshot(): UsageState {
  if (!snapshot) snapshot = readFromStorage();
  return snapshot;
}

export function getUsageServerSnapshot(): UsageState {
  return serverSnapshot;
}

export function setUsageSnapshot(next: UsageState): void {
  snapshot = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(next));
  }
  listeners.forEach((listener) => listener());
}

export function updateUsage(updater: (current: UsageState) => UsageState): void {
  setUsageSnapshot(updater(getUsageSnapshot()));
}
