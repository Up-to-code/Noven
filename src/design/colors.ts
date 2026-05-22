export const colors = {
  background: "#FFFFFF",
  foreground: "#0D0D0F",
  mutedText: "#6F6F73",
  softText: "#9A9AA1",
  border: "#ECECEF",
  surface: "#F7F7F8",
  surfaceDark: "#0D0D0F",
  success: "#1F9D55",
  warning: "#E7A500",
  danger: "#D92D20",
} as const;

export type ColorToken = keyof typeof colors;
