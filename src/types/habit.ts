export type HabitCategory = "Focus" | "Mind" | "Energy" | "Routine";

export type Habit = {
  id: string;
  userId?: string;
  title: string;
  description: string;
  category: HabitCategory;
  frequency: string;
  reminderTime?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
};

export type HabitLog = {
  id: string;
  habitId: string;
  userId: string;
  completedAt: string;
  reflectionId?: string;
};
