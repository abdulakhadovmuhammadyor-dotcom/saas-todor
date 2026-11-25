export const FREE_DAILY_SECONDS = 10 * 60;
export const FREE_DAILY_LESSONS = 5;
export const FREE_TOTAL_LESSONS = 5;

export const USAGE_STORAGE_KEY = "russian-tutor:usage:v1";
export const PRO_STORAGE_KEY = "russian-tutor:pro:v1";
export const ANON_STORAGE_KEY = "russian-tutor:anon:v1";

export const BRAND = {
  paper: "#FAFAFA",
  sage: "#D0D2CF",
  stone: "#575C55",
  gold: "#86612F",
  brown: "#52311B",
} as const;

export const MODEL_ID = "gemini-3.5-flash-lite";

export const PRO_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;
export const STRIPE_STATUS_CACHE_MS = 5 * 60 * 1000;
