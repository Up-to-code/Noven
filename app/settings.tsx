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
  Languages,
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
import { languageOptions, localizeStoredFocus, useAppLocale } from "@/localization";
import { habitReminderOccurrences } from "@/lib/habitSchedule";
import { resetLocalData } from "@/services/database";
import {
  cancelScheduledHabitReminders,
  getNotificationPermissionStatus,
  getNotificationDebugSnapshot,
  syncHabitReminderNotifications,
} from "@/services/notificationService";
import { useHabitStore } from "@/store/habitStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { usePreferenceStore } from "@/store/preferenceStore";
import { useReflectionStore } from "@/store/reflectionStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export default function SettingsScreen() {
  const { t } = useAppLocale();
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
    languageOverride,
    remindersEnabled,
    setAnalyticsRangeDays,
    setRemindersEnabled,
  } = usePreferenceStore();
  const [notificationStatus, setNotificationStatus] = useState<string>("unknown");

  const nextReminder = habits.find((habit) => habit.reminderTime)?.reminderTime;
  const scheduledHabitCount = habits.reduce((sum, habit) => sum + habitReminderOccurrences(habit).length, 0);
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
      t("settings.allowRemindersTitle"),
      t("settings.allowRemindersBody"),
      [
        {
          text: t("settings.notNow"),
          style: "cancel",
          onPress: () => setRemindersEnabled(false),
        },
        {
          text: t("common.continue"),
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
    if (__DEV__) {
      const snapshot = await getNotificationDebugSnapshot();
      console.debug("[notifications] settings enable snapshot", snapshot);
    }
    if (!result.granted) {
      setRemindersEnabled(false);
      Alert.alert(t("settings.notificationsOffTitle"), t("settings.notificationsOffBody"));
    }
  };

  const showNotificationDebug = async () => {
    const snapshot = await getNotificationDebugSnapshot();
    const permission =
      snapshot.permissions && "status" in snapshot.permissions
        ? snapshot.permissions.status
        : notificationStatus;
    console.debug("[notifications] manual debug snapshot", snapshot);
    Alert.alert(
      t("settings.notificationsDebugTitle"),
      t("settings.notificationsDebugBody", {
        permission,
        saved: snapshot.scheduledByPreference.length,
        scheduled: snapshot.scheduledNativeCount,
      }),
    );
  };

  const resetAll = () => {
    Alert.alert(t("settings.resetTitle"), t("settings.resetBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.reset"),
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
      <ScreenHeader title={t("settings.title")} showBack />

      <SettingsSection label={t("settings.identity")}>
        <SettingsGroup>
          <SettingRow icon={User} label={t("settings.name")} value={name || t("settings.add")} onPress={() => router.push("/settings/name")} />
          <SettingRow
            icon={Sparkles}
            label={t("settings.mbti")}
            value={selectedMbti || t("settings.choose")}
            onPress={() => router.push("/settings/mbti")}
          />
          <SettingRow
            icon={BookOpenText}
            label={t("settings.focus")}
            value={selectedFocus ? localizeStoredFocus(selectedFocus, t) : t("settings.choose")}
            onPress={() => router.push("/settings/focus")}
          />
        </SettingsGroup>
      </SettingsSection>

      <SettingsSection label={t("settings.language.section")}>
        <SettingsGroup>
          <SettingRow
            icon={Languages}
            label={t("settings.language.row")}
            value={t(languageOptions.find((option) => option.locale === languageOverride)?.labelKey || "settings.language.system")}
            onPress={() => router.push("/settings/language")}
          />
        </SettingsGroup>
      </SettingsSection>

      <SettingsSection label={t("settings.notifications")}>
        <SettingsGroup>
          <SettingRow
            icon={Bell}
            label={t("settings.habitReminders")}
            value={remindersReady ? t("settings.on") : t("settings.off")}
            switchValue={remindersReady}
            onSwitchValueChange={(value) => {
              toggleHabitReminders(value).catch(console.error);
            }}
          />
          <SettingRow
            icon={Clock}
            label={t("settings.reminderTimes")}
            value={nextReminder ? t("settings.timeCount", { count: scheduledHabitCount }) : t("settings.setInHabits")}
            onPress={__DEV__ ? showNotificationDebug : () => router.push("/(tabs)/habits")}
          />
        </SettingsGroup>
      </SettingsSection>

      <SettingsSection label={t("settings.localData")}>
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
              {t("settings.localSummary", {
                count: Math.max(habits.length, habitLogs.length, reflections.length),
                completions: habitLogs.length,
                habits: habits.length,
                reflections: reflections.length,
              })}
            </Text>
          </View>
        </View>
      </SettingsSection>

      <SettingsSection label={t("settings.analytics")}>
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
              {t("settings.patternRange")}
            </Text>
            <Text variant="small" color="muted">
              {t("patterns.days", { count: analyticsRangeDays })}
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
                  {t("settings.daysShort", { count: range })}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </SettingsSection>

      <SettingsSection label={t("settings.appInfo")}>
        <SettingsGroup>
          <SettingRow
            icon={Crown}
            label={isPremium ? t("profile.manageSubscription") : t("profile.upgradePremium")}
            value={isPremium ? t("settings.active") : t("settings.unlock")}
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
          <SettingRow icon={Shield} label={t("common.privacyPolicy")} value={t("settings.localOnly")} onPress={() => router.push("/legal/privacy")} />
          <SettingRow icon={FileText} label={t("common.terms")} value={t("settings.use")} onPress={() => router.push("/legal/terms")} />
        </SettingsGroup>
      </SettingsSection>

      <View style={{ gap: spacing.smallGap, paddingTop: spacing.compact }}>
        <Button icon={Database} label={t("settings.exportPrompt")} variant="secondary" onPress={() => router.push("/mbti-insights")} />
        <Button icon={RotateCcw} label={t("settings.resetLocalData")} variant="danger" onPress={resetAll} />
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
