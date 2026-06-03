import { describe, expect, test } from "bun:test";

import { dailyProgressSummary, habitReminderOccurrences, parseHabitDailyTarget, parseReminderTime } from "@/lib/habitSchedule";
import type { Habit, HabitLog } from "@/types";

const baseHabit: Habit = {
  id: "focus",
  title: "Focus",
  description: "2 times daily, spaced by 4h.",
  category: "Focus",
  frequency: "2x daily",
  reminderTime: "09:00",
  progress: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("habit schedule", () => {
  test("parses daily target from habit frequency", () => {
    expect(parseHabitDailyTarget(baseHabit)).toBe(2);
    expect(parseHabitDailyTarget({ description: "3 times daily, spaced by 2h.", frequency: "" })).toBe(3);
  });

  test("builds reminder occurrences from start time and gap", () => {
    expect(habitReminderOccurrences(baseHabit)).toEqual([
      { hour: 9, index: 0, minute: 0 },
      { hour: 13, index: 1, minute: 0 },
    ]);
  });

  test("parses 12-hour reminder time", () => {
    expect(parseReminderTime("9:30 PM")).toEqual({ hour: 21, minute: 30 });
    expect(parseReminderTime("12:05 AM")).toEqual({ hour: 0, minute: 5 });
  });

  test("summarizes today progress across all habit repetitions", () => {
    const today = new Date().toISOString();
    const logs: HabitLog[] = [
      { id: "1", habitId: "focus", userId: "local-user", completedAt: today },
      { id: "2", habitId: "focus", userId: "local-user", completedAt: today },
    ];
    const secondHabit = { ...baseHabit, id: "energy", frequency: "1x daily", description: "1 time daily, spaced by 4h." };

    expect(dailyProgressSummary([baseHabit, secondHabit], logs)).toEqual({
      completed: 2,
      progress: 2 / 3,
      totalTarget: 3,
    });
  });
});
