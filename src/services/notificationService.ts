import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { translate } from "@/localization";
import { habitReminderOccurrences } from "@/lib/habitSchedule";
import { loadPreferences, savePreference } from "@/services/database";
import type { Habit } from "@/types";

const reminderPreferenceKey = "scheduledHabitNotificationIds";

type ScheduledReminder = {
  habitId: string;
  notificationId: string;
  occurrenceIndex?: number;
};

type NotificationDebugEvent = {
  details?: Record<string, unknown>;
  message: string;
  timestamp: string;
};

const debugEvents: NotificationDebugEvent[] = [];

export function registerNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function getNotificationPermissionStatus() {
  const permissions = await Notifications.getPermissionsAsync();
  return permissions.status;
}

export async function requestNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function syncHabitReminderNotifications(habits: Habit[], enabled?: boolean) {
  const preferences = await loadPreferences();
  const shouldEnable = enabled ?? preferences.remindersEnabled;
  notificationDebug("sync:start", {
    enabled: shouldEnable,
    habitCount: habits.length,
    habitsWithReminder: habits.filter((habit) => habit.reminderTime).length,
  });
  await cancelScheduledHabitReminders();

  if (!shouldEnable) {
    notificationDebug("sync:disabled");
    return { granted: false, scheduledCount: 0 };
  }

  const granted = await requestNotificationPermission();
  if (!granted) {
    await savePreference("remindersEnabled", false);
    notificationDebug("sync:permission-denied");
    return { granted: false, scheduledCount: 0 };
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("habit-reminders", {
      name: translate("notifications.channelName"),
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const scheduled: ScheduledReminder[] = [];
  for (const habit of habits) {
    const occurrences = habitReminderOccurrences(habit);
    if (!occurrences.length) {
      notificationDebug("sync:skip-habit-no-time", { habitId: habit.id, reminderTime: habit.reminderTime });
      continue;
    }

    for (const occurrence of occurrences) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: habit.title,
          body: translate("notifications.habitReminderBody"),
          data: { habitId: habit.id, occurrenceIndex: occurrence.index, type: "habit-reminder" },
        },
        trigger: {
          channelId: Platform.OS === "android" ? "habit-reminders" : undefined,
          hour: occurrence.hour,
          minute: occurrence.minute,
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
        },
      });
      scheduled.push({ habitId: habit.id, notificationId, occurrenceIndex: occurrence.index });
    }
  }

  await savePreference(reminderPreferenceKey, JSON.stringify(scheduled));
  notificationDebug("sync:complete", { scheduledCount: scheduled.length });
  return { granted: true, scheduledCount: scheduled.length };
}

export async function cancelScheduledHabitReminders() {
  const preferences = await loadPreferences();
  const scheduled = parseScheduledReminders(preferences.scheduledHabitNotificationIds);

  await Promise.all(
    scheduled.map((item) => Notifications.cancelScheduledNotificationAsync(item.notificationId).catch(console.error)),
  );
  await savePreference(reminderPreferenceKey, "[]");
  notificationDebug("cancel:complete", { cancelledCount: scheduled.length });
}

export async function getNotificationDebugSnapshot() {
  const preferences = await loadPreferences();
  const scheduledByPreference = parseScheduledReminders(preferences.scheduledHabitNotificationIds);
  const scheduledNative = await Notifications.getAllScheduledNotificationsAsync().catch((error) => {
    notificationDebug("debug:native-scheduled-failed", { error: error instanceof Error ? error.message : String(error) });
    return [];
  });
  const permissions = await Notifications.getPermissionsAsync().catch((error) => {
    notificationDebug("debug:permissions-failed", { error: error instanceof Error ? error.message : String(error) });
    return undefined;
  });

  return {
    events: [...debugEvents],
    permissions,
    remindersEnabled: preferences.remindersEnabled,
    scheduledByPreference,
    scheduledNativeCount: scheduledNative.length,
    scheduledNative,
  };
}

function parseScheduledReminders(value?: string): ScheduledReminder[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is ScheduledReminder =>
        typeof item?.habitId === "string" && typeof item?.notificationId === "string",
    );
  } catch {
    return [];
  }
}

function notificationDebug(message: string, details?: Record<string, unknown>) {
  const event = { details, message, timestamp: new Date().toISOString() };
  debugEvents.push(event);
  if (debugEvents.length > 50) {
    debugEvents.shift();
  }

  if (__DEV__) {
    console.debug("[notifications]", message, details ?? {});
  }
}
