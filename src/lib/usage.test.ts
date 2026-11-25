import { describe, expect, it } from "vitest";
import {
  applyCompletedLesson,
  applyPracticeSeconds,
  canStartLesson,
  freshUsage,
  lessonsRemaining,
  localDateKey,
  normalizeUsage,
  secondsRemaining,
} from "./usage";

const dailySeconds = 600;
const dailyLessons = 5;
const lessonIds = ["l-1", "l-2", "l-3", "l-4", "l-5"];

describe("usage", () => {
  it("resets when the local calendar day changes", () => {
    const before = new Date(2026, 0, 1, 23, 59);
    const after = new Date(2026, 0, 2, 0, 1);
    const state = { ...freshUsage(before), secondsUsed: 420, completedLessons: ["l-1"] };

    expect(normalizeUsage(state, before)).toEqual(state);
    expect(normalizeUsage(state, after)).toEqual(freshUsage(after));
    expect(localDateKey(after)).toBe("2026-01-02");
  });

  it("caps practice seconds at the free daily limit", () => {
    const state = freshUsage();
    const updated = applyPracticeSeconds(state, 999, dailySeconds, false);

    expect(updated.secondsUsed).toBe(dailySeconds);
    expect(secondsRemaining(updated, dailySeconds, false)).toBe(0);
    expect(secondsRemaining(updated, dailySeconds, true)).toBe(Number.POSITIVE_INFINITY);
  });

  it("counts only free lessons and allows repeating a completed lesson", () => {
    let state = freshUsage();
    for (const id of lessonIds) {
      state = applyCompletedLesson(state, id);
    }

    expect(lessonsRemaining(state, dailyLessons, lessonIds, false)).toBe(0);
    expect(canStartLesson(state, "l-new", dailySeconds, dailyLessons, lessonIds, false)).toBe(false);
    expect(canStartLesson(state, "l-1", dailySeconds, dailyLessons, lessonIds, false)).toBe(true);
    expect(canStartLesson(state, "l-new", dailySeconds, dailyLessons, lessonIds, true)).toBe(true);
  });

  it("rejects malformed stored usage", () => {
    expect(normalizeUsage({ dateKey: "bad", secondsUsed: -1 }, new Date())).toEqual(freshUsage());
  });
});
