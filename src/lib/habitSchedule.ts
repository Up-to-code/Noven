import type { Habit, HabitLog } from "@/types";

export type ReminderTime = {
  hour: number;
  minute: number;
};

export function localDayKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseHabitDailyTarget(habit?: Pick<Habit, "description" | "frequency">) {
  const parsed =
    habit?.frequency.match(/(\d+)x daily/i) ||
    habit?.description.match(/(\d+)\s+times?\s+daily/i) ||
    habit?.description.match(/(\d+)\s+times?/i);

  return clampNumber(parsed ? Number(parsed[1]) : 1, 1, 6);
}

export function parseHabitGapHours(habit?: Pick<Habit, "description">) {
  const parsed = habit?.description.match(/spaced by\s+(\d+)h/i);
  return clampNumber(parsed ? Number(parsed[1]) : 4, 1, 12);
}

export function parseReminderTime(value?: string): ReminderTime | undefined {
  if (!value) {
    return undefined;
  }

  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?:\s*([AP]M))?$/i);
  if (!match) {
    return undefined;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();

  if (Number.isNaN(hour) || Number.isNaN(minute) || minute < 0 || minute > 59) {
    return undefined;
  }

  if (meridiem === "PM" && hour < 12) {
    hour += 12;
  }

  if (meridiem === "AM" && hour === 12) {
    hour = 0;
  }

  if (hour < 0 || hour > 23) {
    return undefined;
  }

  return { hour, minute };
}

export function habitReminderOccurrences(habit: Habit) {
  const first = parseReminderTime(habit.reminderTime);
  if (!first) {
    return [];
  }

  const target = parseHabitDailyTarget(habit);
  const gapHours = parseHabitGapHours(habit);
  const startMinutes = first.hour * 60 + first.minute;

  return Array.from({ length: target }, (_, index) => {
    const totalMinutes = (startMinutes + index * gapHours * 60) % (24 * 60);
    return {
      index,
      hour: Math.floor(totalMinutes / 60),
      minute: totalMinutes % 60,
    };
  });
}

export function completedOnLocalDayCount(logs: HabitLog[], habitId: string, date: Date | string = new Date()) {
  const targetDay = localDayKey(date);
  return logs.filter((log) => log.habitId === habitId && localDayKey(log.completedAt) === targetDay).length;
}

export function dailyProgressSummary(habits: Habit[], logs: HabitLog[], date: Date | string = new Date()) {
  const totalTarget = habits.reduce((sum, habit) => sum + parseHabitDailyTarget(habit), 0);
  const completed = habits.reduce((sum, habit) => {
    const target = parseHabitDailyTarget(habit);
    return sum + Math.min(target, completedOnLocalDayCount(logs, habit.id, date));
  }, 0);

  return {
    completed,
    progress: totalTarget ? completed / totalTarget : 0,
    totalTarget,
  };
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
