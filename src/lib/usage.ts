export interface UsageState {
  dateKey: string;
  secondsUsed: number;
  completedLessons: string[];
}

export function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function freshUsage(date: Date = new Date()): UsageState {
  return { dateKey: localDateKey(date), secondsUsed: 0, completedLessons: [] };
}

function isValidUsage(value: unknown): value is UsageState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<UsageState>;
  return (
    typeof candidate.dateKey === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(candidate.dateKey) &&
    typeof candidate.secondsUsed === "number" &&
    Number.isFinite(candidate.secondsUsed) &&
    candidate.secondsUsed >= 0 &&
    Array.isArray(candidate.completedLessons) &&
    candidate.completedLessons.every((id) => typeof id === "string")
  );
}

export function normalizeUsage(value: unknown, date: Date = new Date()): UsageState {
  if (!isValidUsage(value) || value.dateKey !== localDateKey(date)) {
    return freshUsage(date);
  }
  return value;
}

export function secondsRemaining(state: UsageState, dailySeconds: number, isPro: boolean): number {
  if (isPro) return Number.POSITIVE_INFINITY;
  return Math.max(0, Math.ceil(dailySeconds - state.secondsUsed));
}

export function lessonsRemaining(
  state: UsageState,
  dailyLessons: number,
  lessonIds: string[],
  isPro: boolean,
): number {
  if (isPro) return Number.POSITIVE_INFINITY;
  const count = lessonIds.filter((id) => state.completedLessons.includes(id)).length;
  return Math.max(0, dailyLessons - count);
}

export function canStartLesson(
  state: UsageState,
  lessonId: string,
  dailySeconds: number,
  dailyLessons: number,
  lessonIds: string[],
  isPro: boolean,
): boolean {
  if (isPro) return true;
  if (state.secondsUsed >= dailySeconds) return false;
  if (state.completedLessons.includes(lessonId)) return true;
  return lessonsRemaining(state, dailyLessons, lessonIds, isPro) > 0;
}

export function applyPracticeSeconds(
  state: UsageState,
  seconds: number,
  dailySeconds: number,
  isPro: boolean,
  date: Date = new Date(),
): UsageState {
  const current = normalizeUsage(state, date);
  if (isPro || seconds <= 0) return current;
  return {
    ...current,
    secondsUsed: Math.min(dailySeconds, current.secondsUsed + seconds),
  };
}

export function applyCompletedLesson(
  state: UsageState,
  lessonId: string,
  date: Date = new Date(),
): UsageState {
  const current = normalizeUsage(state, date);
  if (current.completedLessons.includes(lessonId)) return current;
  return {
    ...current,
    completedLessons: [...current.completedLessons, lessonId],
  };
}
