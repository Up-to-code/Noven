import { create } from "zustand";

import { deleteHabit as deleteStoredHabit, saveHabit, saveHabitLog } from "@/services/database";
import { syncHabitReminderNotifications } from "@/services/notificationService";
import type { Habit, HabitLog } from "@/types";

type HabitState = {
  habits: Habit[];
  habitLogs: HabitLog[];
  recommendedHabits: Habit[];
  hydrate: (habits: Habit[], habitLogs?: HabitLog[]) => void;
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  completeHabit: (habitId: string) => void;
  deleteHabit: (habitId: string) => void;
  getHabit: (habitId: string) => Habit | undefined;
  getHabitLogs: (habitId: string) => HabitLog[];
  reset: () => void;
  updateHabit: (habit: Habit) => void;
};

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  habitLogs: [],
  recommendedHabits: [],
  hydrate: (habits, habitLogs = []) => set({ habitLogs, habits }),
  setHabits: (habits) => set({ habits }),
  addHabit: (habit) => {
    let habits: Habit[] = [];
    let didAdd = false;
    const normalizedTitle = normalizeHabitTitle(habit.title);
    set((state) => {
      const duplicate = state.habits.find(
        (item) =>
          item.id === habit.id ||
          (normalizeHabitTitle(item.title) === normalizedTitle &&
            item.category === habit.category &&
            item.frequency === habit.frequency &&
            item.reminderTime === habit.reminderTime),
      );

      if (duplicate) {
        habits = state.habits;
        return state;
      }

      didAdd = true;
      habits = [habit, ...state.habits];
      return { habits };
    });
    if (didAdd) {
      saveHabit(habit).catch(console.error);
      syncHabitReminderNotifications(habits).catch(console.error);
    }
  },
  completeHabit: (habitId) => {
    let updatedHabit: Habit | undefined;
    const completedAt = new Date().toISOString();
    const dayKey = completedAt.slice(0, 10);
    const existingLog = get().habitLogs.find(
      (log) => log.habitId === habitId && log.completedAt.slice(0, 10) === dayKey,
    );
    const habitLog: HabitLog =
      existingLog ||
      {
        id: `log-${habitId}-${dayKey}`,
        habitId,
        userId: "local-user",
        completedAt,
      };

    set((state) => ({
      habitLogs: existingLog ? state.habitLogs : [habitLog, ...state.habitLogs],
      habits: state.habits.map((habit) =>
        habit.id === habitId
          ? (updatedHabit = {
              ...habit,
              progress: Math.min(1, habit.progress + 0.08),
              updatedAt: completedAt,
            })
          : habit,
      ),
    }));
    if (updatedHabit) {
      saveHabit(updatedHabit).catch(console.error);
    }
    if (!existingLog) {
      saveHabitLog(habitLog).catch(console.error);
    }
  },
  deleteHabit: (habitId) => {
    let habits: Habit[] = [];
    set((state) => ({
      habitLogs: state.habitLogs.filter((log) => log.habitId !== habitId),
      habits: (habits = state.habits.filter((habit) => habit.id !== habitId)),
    }));
    deleteStoredHabit(habitId).catch(console.error);
    syncHabitReminderNotifications(habits).catch(console.error);
  },
  getHabit: (habitId: string) => get().habits.find((habit) => habit.id === habitId),
  getHabitLogs: (habitId: string) => get().habitLogs.filter((log) => log.habitId === habitId),
  reset: () =>
    set({
      habitLogs: [],
      habits: [],
    }),
  updateHabit: (habit) => {
    const updatedHabit = { ...habit, updatedAt: new Date().toISOString() };
    let habits: Habit[] = [];
    set((state) => ({
      habits: (habits = state.habits.map((item) => (item.id === updatedHabit.id ? updatedHabit : item))),
    }));
    saveHabit(updatedHabit).catch(console.error);
    syncHabitReminderNotifications(habits).catch(console.error);
  },
}));

function normalizeHabitTitle(title: string) {
  return title.trim().replace(/\s+/g, " ").toLowerCase();
}
