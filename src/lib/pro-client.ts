import "client-only";

import { ANON_STORAGE_KEY, PRO_STORAGE_KEY } from "@/lib/constants";

export function getAnonId(): string {
  if (typeof window === "undefined") return "";
  const existing = window.localStorage.getItem(ANON_STORAGE_KEY);
  if (existing) return existing;
  const created =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(ANON_STORAGE_KEY, created);
  return created;
}

export function getStoredProToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PRO_STORAGE_KEY);
}

export function storeProToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRO_STORAGE_KEY, token);
}

export function clearProToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PRO_STORAGE_KEY);
}

export function getStoredCustomerId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("russian-tutor:customer:v1");
}

export function storeCustomerId(id: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("russian-tutor:customer:v1", id);
}

export function isDemoPro(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("russian-tutor:demo-pro") === "1";
}

export function proHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-pro-token": getStoredProToken() ?? "",
    "x-demo-pro": isDemoPro() ? "1" : "0",
  };
}
