import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { loadPreferences, savePreference } from "@/services/database";
import type { Habit } from "@/types";

const reminderPreferenceKey = "scheduledHabitNotificationIds";

type ScheduledReminder = {
  habitId: string;
  notificationId: string;
};

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
  await cancelScheduledHabitReminders();

  if (!shouldEnable) {
    return { granted: false, scheduledCount: 0 };
  }

  const granted = await requestNotificationPermission();
  if (!granted) {
    await savePreference("remindersEnabled", false);
    return { granted: false, scheduledCount: 0 };
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("habit-reminders", {
      name: "Habit reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const scheduled: ScheduledReminder[] = [];
  for (const habit of habits) {
    const time = parseReminderTime(habit.reminderTime);
    if (!time) {
      continue;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: habit.title,
        body: "A small repetition is enough.",
        data: { habitId: habit.id, type: "habit-reminder" },
      },
      trigger: {
        channelId: Platform.OS === "android" ? "habit-reminders" : undefined,
        hour: time.hour,
        minute: time.minute,
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
      },
    });
    scheduled.push({ habitId: habit.id, notificationId });
  }

  await savePreference(reminderPreferenceKey, JSON.stringify(scheduled));
  return { granted: true, scheduledCount: scheduled.length };
}

export async function cancelScheduledHabitReminders() {
  const preferences = await loadPreferences();
  const scheduled = parseScheduledReminders(preferences.scheduledHabitNotificationIds);

  await Promise.all(
    scheduled.map((item) => Notifications.cancelScheduledNotificationAsync(item.notificationId).catch(console.error)),
  );
  await savePreference(reminderPreferenceKey, "[]");
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

function parseReminderTime(value?: string) {
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
