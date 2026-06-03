import { create } from "zustand";

import type { SupportedLocale } from "@/localization";
import { savePreference } from "@/services/database";

type PreferenceState = {
  analyticsRangeDays: number;
  languageOverride: SupportedLocale;
  remindersEnabled: boolean;
  reflectionPromptsEnabled: boolean;
  milestoneAlertsEnabled: boolean;
  reducedMotionEnabled: boolean;
  largeTextEnabled: boolean;
  appearance: "light";
  hydrate: (preferences: {
    largeTextEnabled?: boolean;
    analyticsRangeDays?: number;
    languageOverride?: string;
    milestoneAlertsEnabled?: boolean;
    reducedMotionEnabled?: boolean;
    reflectionPromptsEnabled?: boolean;
    remindersEnabled: boolean;
    scheduledHabitNotificationIds?: string;
  }) => void;
  setLargeTextEnabled: (largeTextEnabled: boolean) => void;
  setLanguageOverride: (languageOverride: SupportedLocale) => void;
  setAnalyticsRangeDays: (analyticsRangeDays: number) => void;
  setMilestoneAlertsEnabled: (milestoneAlertsEnabled: boolean) => void;
  setReducedMotionEnabled: (reducedMotionEnabled: boolean) => void;
  setReflectionPromptsEnabled: (reflectionPromptsEnabled: boolean) => void;
  setRemindersEnabled: (remindersEnabled: boolean) => void;
};

export const usePreferenceStore = create<PreferenceState>((set) => ({
  analyticsRangeDays: 30,
  languageOverride: "system",
  remindersEnabled: false,
  reflectionPromptsEnabled: true,
  milestoneAlertsEnabled: true,
  reducedMotionEnabled: false,
  largeTextEnabled: false,
  appearance: "light",
  hydrate: (preferences) =>
    set({
      ...preferences,
      languageOverride: isSupportedLocale(preferences.languageOverride) ? preferences.languageOverride : "system",
    }),
  setAnalyticsRangeDays: (analyticsRangeDays) => {
    set({ analyticsRangeDays });
    savePreference("analyticsRangeDays", String(analyticsRangeDays)).catch(console.error);
  },
  setLargeTextEnabled: (largeTextEnabled) => {
    set({ largeTextEnabled });
    savePreference("largeTextEnabled", largeTextEnabled).catch(console.error);
  },
  setLanguageOverride: (languageOverride) => {
    set({ languageOverride });
    savePreference("languageOverride", languageOverride).catch(console.error);
  },
  setMilestoneAlertsEnabled: (milestoneAlertsEnabled) => {
    set({ milestoneAlertsEnabled });
    savePreference("milestoneAlertsEnabled", milestoneAlertsEnabled).catch(console.error);
  },
  setReducedMotionEnabled: (reducedMotionEnabled) => {
    set({ reducedMotionEnabled });
    savePreference("reducedMotionEnabled", reducedMotionEnabled).catch(console.error);
  },
  setReflectionPromptsEnabled: (reflectionPromptsEnabled) => {
    set({ reflectionPromptsEnabled });
    savePreference("reflectionPromptsEnabled", reflectionPromptsEnabled).catch(console.error);
  },
  setRemindersEnabled: (remindersEnabled) => {
    set({ remindersEnabled });
    savePreference("remindersEnabled", remindersEnabled).catch(console.error);
  },
}));

function isSupportedLocale(value?: string): value is SupportedLocale {
  return (
    value === "system" ||
    value === "en-US" ||
    value === "en-GB" ||
    value === "ja-JP" ||
    value === "fr-FR" ||
    value === "fr-CH" ||
    value === "it-IT" ||
    value === "pt-PT" ||
    value === "pt-BR"
  );
}
