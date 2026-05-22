import { create } from "zustand";

import { savePreference } from "@/services/database";

type PreferenceState = {
  analyticsRangeDays: number;
  remindersEnabled: boolean;
  reflectionPromptsEnabled: boolean;
  milestoneAlertsEnabled: boolean;
  reducedMotionEnabled: boolean;
  largeTextEnabled: boolean;
  appearance: "light";
  hydrate: (preferences: {
    largeTextEnabled?: boolean;
    analyticsRangeDays?: number;
    milestoneAlertsEnabled?: boolean;
    reducedMotionEnabled?: boolean;
    reflectionPromptsEnabled?: boolean;
    remindersEnabled: boolean;
    scheduledHabitNotificationIds?: string;
  }) => void;
  setLargeTextEnabled: (largeTextEnabled: boolean) => void;
  setAnalyticsRangeDays: (analyticsRangeDays: number) => void;
  setMilestoneAlertsEnabled: (milestoneAlertsEnabled: boolean) => void;
  setReducedMotionEnabled: (reducedMotionEnabled: boolean) => void;
  setReflectionPromptsEnabled: (reflectionPromptsEnabled: boolean) => void;
  setRemindersEnabled: (remindersEnabled: boolean) => void;
};

export const usePreferenceStore = create<PreferenceState>((set) => ({
  analyticsRangeDays: 30,
  remindersEnabled: false,
  reflectionPromptsEnabled: true,
  milestoneAlertsEnabled: true,
  reducedMotionEnabled: false,
  largeTextEnabled: false,
  appearance: "light",
  hydrate: (preferences) => set(preferences),
  setAnalyticsRangeDays: (analyticsRangeDays) => {
    set({ analyticsRangeDays });
    savePreference("analyticsRangeDays", String(analyticsRangeDays)).catch(console.error);
  },
  setLargeTextEnabled: (largeTextEnabled) => {
    set({ largeTextEnabled });
    savePreference("largeTextEnabled", largeTextEnabled).catch(console.error);
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
