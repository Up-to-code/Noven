import * as Haptics from "expo-haptics";

export type FeedbackTone = "add" | "next" | "select" | "success";

export function playFeedback(tone: FeedbackTone = "select") {
  const action =
    tone === "add"
      ? Haptics.ImpactFeedbackStyle.Medium
      : tone === "next"
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Soft;

  if (tone === "success") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    return;
  }

  Haptics.impactAsync(action).catch(() => {});
}
