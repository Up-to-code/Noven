import { Alert, Pressable, Switch, View } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Bell,
  BookOpenText,
  CalendarDays,
  Clock,
  ChevronRight,
  Database,
  Crown,
  FileText,
  RotateCcw,
  Shield,
  Sparkles,
  User,
  type LucideProps,
} from "lucide-react-native";
import type { ComponentType, ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { resetLocalData } from "@/services/database";
import {
  cancelScheduledHabitReminders,
  getNotificationPermissionStatus,
  syncHabitReminderNotifications,
} from "@/services/notificationService";
import { useHabitStore } from "@/store/habitStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { usePreferenceStore } from "@/store/preferenceStore";
import { useReflectionStore } from "@/store/reflectionStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export default function SettingsScreen() {
  const name = useOnboardingStore((state) => state.name);
  const selectedMbti = useOnboardingStore((state) => state.selectedMbti);
  const selectedFocus = useOnboardingStore((state) => state.selectedFocus);
  const resetOnboarding = useOnboardingStore((state) => state.reset);
  const resetHabits = useHabitStore((state) => state.reset);
  const habitLogs = useHabitStore((state) => state.habitLogs);
  const habits = useHabitStore((state) => state.habits);
  const reflections = useReflectionStore((state) => state.reflections);
  const resetDraft = useReflectionStore((state) => state.resetDraft);
  const isPremium = useSubscriptionStore((state) => state.isPremium);
  const {
    analyticsRangeDays,
    remindersEnabled,
    setAnalyticsRangeDays,
    setRemindersEnabled,
  } = usePreferenceStore();
  const [notificationStatus, setNotificationStatus] = useState<string>("unknown");

  const nextReminder = habits.find((habit) => habit.reminderTime)?.reminderTime;
  const scheduledHabitCount = habits.filter((habit) => habit.reminderTime).length;
  const remindersReady = remindersEnabled && notificationStatus === "granted";

  useEffect(() => {
    getNotificationPermissionStatus()
      .then((status) => {
        setNotificationStatus(status);
        if (status !== "granted" && remindersEnabled) {
          setRemindersEnabled(false);
          cancelScheduledHabitReminders().catch(console.error);
        }
      })
      .catch(() => setNotificationStatus("unknown"));
  }, [remindersEnabled, setRemindersEnabled]);

  const toggleHabitReminders = async (enabled: boolean) => {
    if (!enabled) {
      setRemindersEnabled(false);
      await cancelScheduledHabitReminders();
      setNotificationStatus(await getNotificationPermissionStatus());
      return;
    }

    Alert.alert(
      "Allow habit reminders?",
      "Noven uses local notifications only for the habit reminder times you set. You can turn them off here at any time.",
      [
        {
          text: "Not Now",
          style: "cancel",
          onPress: () => setRemindersEnabled(false),
        },
        {
          text: "Continue",
          onPress: () => {
            enableHabitReminders().catch(console.error);
          },
        },
      ],
    );
  };

  const enableHabitReminders = async () => {
    setRemindersEnabled(true);
    const result = await syncHabitReminderNotifications(habits, true);
    setNotificationStatus(await getNotificationPermissionStatus());
    if (!result.granted) {
      setRemindersEnabled(false);
      Alert.alert("Notifications are off", "Allow notifications in iOS Settings to receive habit reminders.");
    }
  };

  const resetAll = () => {
    Alert.alert("Reset local data?", "This clears your profile, habits, logs, and reflections from this device.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          resetLocalData().catch(console.error);
          resetOnboarding();
          resetHabits();
          resetDraft();
          router.replace("/onboarding/welcome");
        },
      },
    ]);
  };

  return (
    <Screen topPadding={spacing.compact} contentStyle={{ gap: spacing.componentGap + spacing.compact }}>
      <ScreenHeader title="Settings" showBack />

      <SettingsSection label="IDENTITY">
        <SettingsGroup>
          <SettingRow icon={User} label="Name" value={name || "Add"} onPress={() => router.push("/settings/name")} />
          <SettingRow
            icon={Sparkles}
            label="MBTI"
            value={selectedMbti || "Choose"}
            onPress={() => router.push("/settings/mbti")}
          />
          <SettingRow
            icon={BookOpenText}
            label="Focus"
            value={selectedFocus || "Choose"}
            onPress={() => router.push("/settings/focus")}
          />
        </SettingsGroup>
      </SettingsSection>

      <SettingsSection label="NOTIFICATIONS">
        <SettingsGroup>
          <SettingRow
            icon={Bell}
            label="Habit reminders"
            value={remindersReady ? "On" : "Off"}
            switchValue={remindersReady}
            onSwitchValueChange={(value) => {
              toggleHabitReminders(value).catch(console.error);
            }}
          />
          <SettingRow
            icon={Clock}
            label="Reminder times"
            value={nextReminder ? `${scheduledHabitCount} time${scheduledHabitCount === 1 ? "" : "s"}` : "Set in habits"}
            onPress={() => router.push("/(tabs)/habits")}
          />
        </SettingsGroup>
      </SettingsSection>

      <SettingsSection label="LOCAL DATA">
        <View
          style={{
            borderRadius: radius.input,
            borderCurve: "continuous",
            backgroundColor: colors.surface,
            paddingHorizontal: spacing.componentGap,
            paddingVertical: spacing.componentGap,
          }}
        >
          <View style={{ flexDirection: "row", gap: spacing.smallGap + spacing.compact, alignItems: "center" }}>
            <Database color={colors.foreground} size={18} strokeWidth={1.6} />
            <Text variant="small" style={{ flex: 1 }}>
              {habits.length} habit{habits.length === 1 ? "" : "s"} · {habitLogs.length} completion
              {habitLogs.length === 1 ? "" : "s"} · {reflections.length} reflection
              {reflections.length === 1 ? "" : "s"}
            </Text>
          </View>
        </View>
      </SettingsSection>

      <SettingsSection label="ANALYTICS">
        <View
          style={{
            gap: spacing.smallGap,
            borderRadius: radius.input,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            padding: spacing.componentGap,
          }}
        >
          <View style={{ flexDirection: "row", gap: spacing.smallGap + spacing.compact, alignItems: "center" }}>
            <CalendarDays color={colors.foreground} size={18} strokeWidth={1.6} />
            <Text variant="small" style={{ flex: 1 }}>
              Pattern range
            </Text>
            <Text variant="small" color="muted">
              {analyticsRangeDays} days
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: spacing.smallGap }}>
            {[30, 90, 180].map((range) => (
              <Pressable
                key={range}
                onPress={() => setAnalyticsRangeDays(range)}
                style={({ pressed }) => ({
                  flex: 1,
                  minHeight: 36,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: radius.pill,
                  backgroundColor: analyticsRangeDays === range ? colors.foreground : colors.surface,
                  opacity: pressed ? 0.78 : 1,
                })}
              >
                <Text variant="small" color={analyticsRangeDays === range ? "inverse" : "default"}>
                  {range}d
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </SettingsSection>

      <SettingsSection label="APP INFO">
        <SettingsGroup>
          <SettingRow
            icon={Crown}
            label={isPremium ? "Manage subscription" : "Upgrade to Premium"}
            value={isPremium ? "Active" : "Unlock"}
            onPress={() =>
              router.push({
                pathname: "/paywall",
                params: {
                  placement: "settings",
                  returnTo: "/settings",
                },
              })
            }
          />
          <SettingRow icon={Shield} label="Privacy Policy" value="Local only" onPress={() => router.push("/legal/privacy")} />
          <SettingRow icon={FileText} label="Terms" value="Use" onPress={() => router.push("/legal/terms")} />
        </SettingsGroup>
      </SettingsSection>

      <View style={{ gap: spacing.smallGap, paddingTop: spacing.compact }}>
        <Button icon={Database} label="Export Prompt" variant="secondary" onPress={() => router.push("/mbti-insights")} />
        <Button icon={RotateCcw} label="Reset Local Data" variant="danger" onPress={resetAll} />
      </View>
    </Screen>
  );
}

function SettingsSection({ children, label }: { children: ReactNode; label: string }) {
  return (
    <View style={{ gap: spacing.smallGap + spacing.compact }}>
      <Text variant="caption" color="muted">
        {label}
      </Text>
      {children}
    </View>
  );
}

function SettingsGroup({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        overflow: "hidden",
        borderRadius: radius.input,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      {children}
    </View>
  );
}

function SettingRow({
  icon: Icon,
  label,
  onPress,
  onSwitchValueChange,
  switchValue,
  value,
}: {
  icon: ComponentType<LucideProps>;
  label: string;
  onPress?: () => void;
  onSwitchValueChange?: (value: boolean) => void;
  switchValue?: boolean;
  value: string;
}) {
  const isSwitch = typeof switchValue === "boolean" && onSwitchValueChange;

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 52,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.smallGap + spacing.compact,
        paddingHorizontal: spacing.componentGap,
        paddingVertical: spacing.smallGap,
        backgroundColor: pressed ? colors.surface : colors.background,
      })}
    >
      <Icon color={colors.foreground} size={18} strokeWidth={1.6} />
      <Text variant="small" style={{ flex: 1 }}>
        {label}
      </Text>
      {!isSwitch ? (
        <Text variant="small" color="muted" numberOfLines={1} style={{ maxWidth: 136 }}>
          {value}
        </Text>
      ) : null}
      {isSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onSwitchValueChange}
          trackColor={{ false: colors.border, true: colors.foreground }}
          thumbColor={colors.background}
          style={{ transform: [{ scaleX: 0.82 }, { scaleY: 0.82 }] }}
        />
      ) : onPress ? (
        <ChevronRight color={colors.softText} size={16} strokeWidth={1.6} />
      ) : null}
    </Pressable>
  );
}
