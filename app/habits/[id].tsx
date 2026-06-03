import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Animated, PanResponder, Pressable, View } from "react-native";
import {
  AlarmClock,
  BarChart3,
  Check,
  ChevronRight,
  Flame,
  HandGrab,
  Info,
  MoreHorizontal,
  SlidersHorizontal,
  Sparkle,
  TrendingUp,
  Trash2,
} from "lucide-react-native";

import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { useResponsiveMetrics } from "@/hooks/useResponsiveMetrics";
import { translate, useAppLocale } from "@/localization";
import { playFeedback } from "@/lib/feedback";
import { completionRate, currentStreak, weeklyCompletionText } from "@/lib/habitAnalytics";
import { useHabitStore } from "@/store/habitStore";
import { useReflectionStore } from "@/store/reflectionStore";
import type { Habit } from "@/types/habit";

export default function HabitDetailScreen() {
  const { t } = useAppLocale();
  const { id } = useLocalSearchParams<{ id: string }>();
  const metrics = useResponsiveMetrics({ horizontalPadding: spacing.screenHorizontal });
  const habit = useHabitStore((state) => state.getHabit(id));
  const habitLogs = useHabitStore((state) => state.habitLogs);
  const completeHabit = useHabitStore((state) => state.completeHabit);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);
  const clearReflectionsForHabit = useReflectionStore((state) => state.clearForHabit);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!habit) {
    return (
      <Screen>
        <ScreenHeader showBack />
        <Text variant="heading">{t("habits.notFoundTitle")}</Text>
        <Text color="muted" variant="body">
          {t("habits.notFoundBody")}
        </Text>
      </Screen>
    );
  }

  const logs = habitLogs.filter((log) => log.habitId === habit.id);
  const streak = currentStreak(habitLogs, habit.id);
  const rate = Math.round(completionRate(habitLogs, habit) * 100);
  const titleSize = metrics.scaleWidth(0.11, 36, 48);
  const iconSize = metrics.scaleWidth(0.12, 42, 54);
  const cardRadius = metrics.isCompact ? 18 : 22;
  const swipeHeight = metrics.scaleHeight(0.074, 60, 72);

  const confirmDelete = () => {
    setIsMenuOpen(false);
    Alert.alert(t("habits.deleteTitle"), t("habits.deleteBody"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("habits.deleteAction"),
        style: "destructive",
        onPress: () => {
          clearReflectionsForHabit(habit.id);
          deleteHabit(habit.id);
          router.replace("/(tabs)/habits");
        },
      },
    ]);
  };

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ gap: spacing.componentGap }}>
      <View style={{ position: "relative", zIndex: 2 }}>
        <ScreenHeader showBack />
        <Pressable
          accessibilityLabel={t("habits.actionsLabel")}
          accessibilityRole="button"
          onPress={() => setIsMenuOpen((value) => !value)}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 42,
            height: 42,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: radius.pill,
            borderWidth: 1,
            borderColor: colors.border,
            borderCurve: "continuous",
            backgroundColor: colors.background,
          }}
        >
          <MoreHorizontal color={colors.foreground} size={20} strokeWidth={1.8} />
        </Pressable>

        {isMenuOpen ? (
          <View
            style={{
              position: "absolute",
              right: 0,
              top: spacing.touch,
              width: 220,
              borderRadius: radius.input,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.background,
              overflow: "hidden",
            }}
          >
            <Pressable
              onPress={() => {
                setIsMenuOpen(false);
                router.push(`/habits/${habit.id}/adjust`);
              }}
              style={{
                minHeight: spacing.touch,
                paddingHorizontal: spacing.componentGap,
                alignItems: "center",
                flexDirection: "row",
                gap: spacing.smallGap,
              }}
            >
              <SlidersHorizontal color={colors.foreground} size={18} strokeWidth={1.8} />
              <Text variant="small">{t("habits.editSettings")}</Text>
            </Pressable>
            <View style={{ height: 1, backgroundColor: colors.border }} />
            <Pressable
              onPress={confirmDelete}
              style={{
                minHeight: spacing.touch,
                paddingHorizontal: spacing.componentGap,
                alignItems: "center",
                flexDirection: "row",
                gap: spacing.smallGap,
              }}
            >
              <Trash2 color={colors.danger} size={18} strokeWidth={1.8} />
              <Text color="danger" variant="small">
                {t("habits.deleteGoal")}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <View
        style={{
          minHeight: metrics.scaleHeight(0.16, 128, 174),
          borderRadius: cardRadius,
          borderCurve: "continuous",
          backgroundColor: colors.surface,
          padding: spacing.componentGap,
          justifyContent: "center",
        }}
      >
        <View style={{ gap: spacing.smallGap }}>
          <Text variant="display" style={{ fontSize: titleSize, lineHeight: titleSize + 8 }}>
            {habit.title}
          </Text>
          <Text color="muted" variant="body" style={{ fontSize: 15, lineHeight: 23 }}>
            {habit.description || frequencySummary(habit)}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: spacing.smallGap }}>
        <View
          style={{
            flex: 1,
            minHeight: 112,
            borderRadius: cardRadius,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: colors.border,
            padding: 14,
            gap: spacing.smallGap,
          }}
        >
          <Flame color="#F28F98" size={iconSize * 0.52} strokeWidth={1.9} />
          <Text color="muted" variant="caption">
            {t("habits.streak")}
          </Text>
          <Text variant="display" style={{ fontSize: titleSize * 0.78, lineHeight: titleSize * 0.86 }}>
            {streak}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            minHeight: 112,
            borderRadius: cardRadius,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: colors.border,
            padding: 14,
            gap: spacing.smallGap,
          }}
        >
          <TrendingUp color="#F28F98" size={iconSize * 0.52} strokeWidth={1.9} />
          <Text color="muted" variant="caption">
            {t("patterns.title")}
          </Text>
          <Text variant="display" style={{ fontSize: titleSize * 0.78, lineHeight: titleSize * 0.86 }}>
            {rate}%
          </Text>
        </View>
      </View>

      <View
        style={{
          borderRadius: cardRadius,
          borderCurve: "continuous",
          backgroundColor: colors.surface,
          padding: spacing.componentGap,
          gap: spacing.componentGap,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.smallGap }}>
          <Info color="#F28F98" size={22} strokeWidth={1.9} />
          <Text variant="caption">{t("habits.about")}</Text>
        </View>
        <Text color="muted" variant="body">
          {logs.length ? `${logs.length} ${t("habits.completion", { count: logs.length })}` : t("habits.noWeeklyCompletions")}
        </Text>
      </View>

      <Pressable onPress={() => router.push(`/habits/${habit.id}/adjust`)}>
        {({ pressed }) => (
          <View
            style={{
              minHeight: 86,
              borderRadius: cardRadius,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: colors.border,
              padding: spacing.componentGap,
              alignItems: "center",
              flexDirection: "row",
              gap: spacing.componentGap,
              opacity: pressed ? 0.78 : 1,
            }}
          >
            <AlarmClock color="#F28F98" size={24} strokeWidth={1.9} />
            <View style={{ flex: 1, gap: spacing.compact }}>
              <Text variant="caption">{t("habits.reminders")}</Text>
              <Text variant="body" style={{ fontSize: 24, lineHeight: 30 }}>
                {habit.reminderTime || t("categories.Routine")}
              </Text>
            </View>
            <ChevronRight color={colors.softText} size={22} strokeWidth={1.8} />
          </View>
        )}
      </Pressable>

      <View
        style={{
          minHeight: 86,
          borderRadius: cardRadius,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.componentGap,
          alignItems: "center",
          flexDirection: "row",
          gap: spacing.componentGap,
        }}
      >
        <BarChart3 color="#F28F98" size={24} strokeWidth={1.9} />
        <View style={{ flex: 1, gap: spacing.compact }}>
          <Text variant="caption">{t("habits.weeklyProgress")}</Text>
          <Text color="muted" variant="body">
            {weeklyCompletionText(habitLogs, habit.id)}
          </Text>
        </View>
      </View>

      <SwipeCompleteButton
        height={swipeHeight}
        onComplete={() => {
          completeHabit(habit.id);
          router.push(`/habits/${habit.id}/reflection`);
        }}
      />
    </Screen>
  );
}

function frequencySummary(habit: Habit) {
  if (habit.reminderTime) {
    return habit.frequency;
  }

  return habit.frequency || translate("habits.rhythmSubtitle");
}

function SwipeCompleteButton({ height, onComplete }: { height: number; onComplete: () => void }) {
  const { t } = useAppLocale();
  const translateX = useRef(new Animated.Value(0)).current;
  const currentTranslateRef = useRef(0);
  const grabOffsetRef = useRef(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const padding = 6;
  const handleSize = Math.max(48, height - padding * 2);
  const fingerAllowance = handleSize * 0.5;
  const maxTranslate = Math.max(trackWidth - handleSize - padding * 2, 0);
  const maxTranslateRef = useRef(0);
  const isCompleteRef = useRef(false);
  maxTranslateRef.current = maxTranslate;
  isCompleteRef.current = isComplete;

  const setThumbPosition = (value: number) => {
    const nextValue = Math.min(Math.max(value, 0), maxTranslateRef.current);
    currentTranslateRef.current = nextValue;
    translateX.setValue(nextValue);
  };

  const reset = () => {
    currentTranslateRef.current = 0;
    Animated.spring(translateX, {
      toValue: 0,
      damping: 18,
      mass: 0.8,
      stiffness: 180,
      useNativeDriver: true,
    }).start();
  };

  const completeSwipe = () => {
    if (isCompleteRef.current) {
      return;
    }

    const target = maxTranslateRef.current;
    isCompleteRef.current = true;
    setIsComplete(true);
    currentTranslateRef.current = target;
    Animated.spring(translateX, {
      toValue: target,
      damping: 18,
      mass: 0.8,
      stiffness: 190,
      useNativeDriver: true,
    }).start(() => {
      playFeedback("success");
      onComplete();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (event, gesture) => {
        const fingerX = event.nativeEvent.locationX;
        const thumbLeft = padding + currentTranslateRef.current - fingerAllowance;
        const thumbRight = padding + currentTranslateRef.current + handleSize + fingerAllowance;

        return (
          fingerX >= thumbLeft &&
          fingerX <= thumbRight &&
          Math.abs(gesture.dx) > 3 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy) * 0.55
        );
      },
      onStartShouldSetPanResponder: (event) => {
        const fingerX = event.nativeEvent.locationX;
        const thumbLeft = padding + currentTranslateRef.current - fingerAllowance;
        const thumbRight = padding + currentTranslateRef.current + handleSize + fingerAllowance;

        return fingerX >= thumbLeft && fingerX <= thumbRight;
      },
      onPanResponderGrant: () => {
        playFeedback("select");
        translateX.stopAnimation((value) => {
          currentTranslateRef.current = value;
        });
      },
      onPanResponderStart: (event) => {
        const fingerX = event.nativeEvent.locationX;
        const thumbLeft = padding + currentTranslateRef.current;
        grabOffsetRef.current = Math.min(Math.max(fingerX - thumbLeft, -fingerAllowance), handleSize + fingerAllowance);
      },
      onPanResponderMove: (event) => {
        setThumbPosition(event.nativeEvent.locationX - padding - grabOffsetRef.current);
        if (currentTranslateRef.current >= maxTranslateRef.current * 0.35) {
          completeSwipe();
        }
      },
      onPanResponderRelease: (_, gesture) => {
        const completed = currentTranslateRef.current >= maxTranslateRef.current * 0.35 || gesture.vx > 0.78;

        if (completed) {
          completeSwipe();
          return;
        }

        reset();
      },
      onPanResponderTerminate: reset,
    }),
  ).current;

  return (
    <View
      {...panResponder.panHandlers}
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
      style={{
        minHeight: height,
        borderRadius: radius.pill,
        borderCurve: "continuous",
        backgroundColor: colors.foreground,
        justifyContent: "center",
        overflow: "hidden",
        paddingHorizontal: padding,
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: padding + handleSize,
          right: padding,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: spacing.smallGap,
        }}
      >
        <Text color="inverse" variant="body" style={{ fontFamily: "Inter SemiBold", fontSize: 15, lineHeight: 22 }}>
          {t("habits.swipeComplete")}
        </Text>
        <Sparkle color={colors.background} size={16} strokeWidth={1.8} />
      </View>
      <Animated.View
        pointerEvents="none"
        style={{
          width: handleSize,
          height: handleSize,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radius.pill,
          backgroundColor: colors.background,
          transform: [{ translateX }],
        }}
      >
        {isComplete ? (
          <Check color={colors.foreground} size={26} strokeWidth={2} />
        ) : (
          <HandGrab color={colors.foreground} size={22} strokeWidth={1.8} />
        )}
      </Animated.View>
    </View>
  );
}
