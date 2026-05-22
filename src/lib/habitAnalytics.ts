import type { Habit, HabitLog } from "@/types";

const dayMs = 24 * 60 * 60 * 1000;

export function dayKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

export function logsForHabit(logs: HabitLog[], habitId?: string) {
  return habitId ? logs.filter((log) => log.habitId === habitId) : logs;
}

export function isCompletedToday(logs: HabitLog[], habitId: string) {
  const today = dayKey(new Date());
  return logs.some((log) => log.habitId === habitId && log.completedAt.slice(0, 10) === today);
}

export function completionRate(logs: HabitLog[], habit?: Habit, days = 90) {
  if (!habit) {
    return 0;
  }

  const createdAt = new Date(habit.createdAt).getTime();
  const activeDays = Math.max(1, Math.min(days, Math.ceil((Date.now() - createdAt) / dayMs) + 1));
  const cutoff = Date.now() - activeDays * dayMs;
  const completedDays = new Set(
    logs
      .filter((log) => log.habitId === habit.id && new Date(log.completedAt).getTime() >= cutoff)
      .map((log) => log.completedAt.slice(0, 10)),
  );

  return Math.min(1, completedDays.size / activeDays);
}

export function currentStreak(logs: HabitLog[], habitId?: string) {
  const completedDays = new Set(logsForHabit(logs, habitId).map((log) => log.completedAt.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();

  while (completedDays.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function bestDay(logs: HabitLog[], habitId?: string) {
  const counts = new Map<number, number>();
  logsForHabit(logs, habitId).forEach((log) => {
    const day = new Date(log.completedAt).getDay();
    counts.set(day, (counts.get(day) || 0) + 1);
  });

  if (!counts.size) {
    return "None yet";
  }

  const [day] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return new Intl.DateTimeFormat("en", { weekday: "long" }).format(new Date(2026, 0, 4 + day));
}

export function heatmapLevels(logs: HabitLog[], habitId?: string, days = 90) {
  const countsByDay = new Map<string, number>();
  logsForHabit(logs, habitId).forEach((log) => {
    const key = log.completedAt.slice(0, 10);
    countsByDay.set(key, (countsByDay.get(key) || 0) + 1);
  });

  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    const count = countsByDay.get(dayKey(date)) || 0;
    return Math.min(3, count);
  });
}

export function firstHabitActivityDate(logs: HabitLog[], habit?: Habit) {
  const dates = logsForHabit(logs, habit?.id).map((log) => new Date(log.completedAt).getTime());
  if (habit?.createdAt) {
    dates.push(new Date(habit.createdAt).getTime());
  }

  if (!dates.length) {
    return undefined;
  }

  return new Date(Math.min(...dates));
}

export function heatmapDaysFromStart(logs: HabitLog[], habit?: Habit, days = 30) {
  const countsByDay = new Map<string, number>();
  logsForHabit(logs, habit?.id).forEach((log) => {
    const key = log.completedAt.slice(0, 10);
    countsByDay.set(key, (countsByDay.get(key) || 0) + 1);
  });

  const today = new Date();
  const firstDate = firstHabitActivityDate(logs, habit) || new Date();
  const maxStart = new Date(today);
  maxStart.setDate(today.getDate() - (days - 1));
  const start = firstDate > maxStart ? firstDate : maxStart;

  const totalDays = Math.max(1, Math.min(days, Math.floor((today.getTime() - start.getTime()) / dayMs) + 1));

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const count = countsByDay.get(dayKey(date)) || 0;
    return {
      date,
      level: Math.min(3, count),
    };
  });
}

export function heatmapLevelsFromStart(logs: HabitLog[], habit?: Habit, days = 30) {
  return heatmapDaysFromStart(logs, habit, days).map((item) => item.level);
}

export function completionSummary(logs: HabitLog[], habit?: Habit, days = 30) {
  const levels = heatmapLevelsFromStart(logs, habit, days);
  const completedDays = levels.filter((level) => level > 0).length;
  const rate = levels.length ? completedDays / levels.length : 0;

  return {
    completedDays,
    rate,
    totalDays: levels.length,
  };
}

export function weeklyCompletionText(logs: HabitLog[], habitId: string) {
  const days = heatmapLevels(logs, habitId, 7);
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const start = new Date();
  start.setDate(start.getDate() - 6);

  const completed = days
    .map((level, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return level > 0 ? labels[date.getDay()] : undefined;
    })
    .filter(Boolean);

  return completed.length ? completed.join(" · ") : "No completions this week yet";
}

export function averageCompletionRate(habits: Habit[], logs: HabitLog[], days = 90) {
  if (!habits.length) {
    return 0;
  }

  return habits.reduce((sum, habit) => sum + completionRate(logs, habit, days), 0) / habits.length;
}
