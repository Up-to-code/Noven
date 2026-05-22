export type ReflectionOption =
  | "Felt focused"
  | "Had enough time"
  | "Felt stressed"
  | "Was distracted"
  | "Forgot"
  | "Not in the mood";

export type Reflection = {
  id: string;
  habitId?: string;
  userId: string;
  options: ReflectionOption[];
  notes?: string;
  createdAt: string;
};
