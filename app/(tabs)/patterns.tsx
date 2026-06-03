import { Pressable, useWindowDimensions, View } from "react-native";
import { router } from "expo-router";

import { AddHabitGlyph } from "@/components/ui/AddHabitGlyph";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { useHabitCreationGate } from "@/hooks/useHabitCreationGate";
import { useAppLocale } from "@/localization";
import { completionSummary, heatmapDaysFromStart } from "@/lib/habitAnalytics";
import { useHabitStore } from "@/store/habitStore";
import { usePreferenceStore } from "@/store/preferenceStore";
import type { Habit } from "@/types";

type ContributionDay = {
  date: Date;
  level: number;
};

const chartColumns = 15;
const chartGap = 6;

export default function PatternsScreen() {
  const { t } = useAppLocale();
  const habits = useHabitStore((state) => state.habits);
  const habitLogs = useHabitStore((state) => state.habitLogs);
  const analyticsRangeDays = usePreferenceStore((state) => state.analyticsRangeDays);
  const openCreateHabit = useHabitCreationGate("/(tabs)/patterns");

  return (
    <Screen scroll={habits.length > 0} topPadding={spacing.smallGap} contentStyle={{ gap: spacing.componentGap }}>
      <ScreenHeader showSettings />
      <View style={{ gap: spacing.smallGap }}>
        <Text variant="caption">{t("patterns.analytics")}</Text>
        <View style={{ flex: 1 }}>
          <Text variant="heading">{t("patterns.title")}</Text>
        </View>
      </View>

      {habits.length ? (
        <Screen.Section>
          {habits.map((habit) => (
            <HabitPatternCard
              key={habit.id}
              analyticsRangeDays={analyticsRangeDays}
              habit={habit}
              habitLogs={habitLogs}
            />
          ))}
        </Screen.Section>
      ) : (
        <View style={{ alignItems: "center", marginTop: spacing.sectionGap }}>
          <AddHabitGlyph label={t("habits.addFirstHabit")} onPress={openCreateHabit} />
        </View>
      )}
    </Screen>
  );
}

function HabitPatternCard({
  analyticsRangeDays,
  habit,
  habitLogs,
}: {
  analyticsRangeDays: number;
  habit: Habit;
  habitLogs: ReturnType<typeof useHabitStore.getState>["habitLogs"];
}) {
  const days = heatmapDaysFromStart(habitLogs, habit, analyticsRangeDays);
  const summary = completionSummary(habitLogs, habit, analyticsRangeDays);
  const { t } = useAppLocale();

  return (
    <Pressable onPress={() => router.push(`/habits/${habit.id}`)}>
      {({ pressed }) => (
        <Card variant="surface" style={{ gap: 18, opacity: pressed ? 0.82 : 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.componentGap }}>
            <View style={{ flex: 1, gap: spacing.compact }}>
              <Text variant="body" numberOfLines={1}>
                {habit.title}
              </Text>
              <Text variant="small" color="muted">
                {t(`categories.${habit.category}`)} · {t("patterns.days", { count: analyticsRangeDays })}
              </Text>
            </View>
            <Text variant="body">{Math.round(summary.rate * 100)}%</Text>
          </View>
          <ContributionChart days={days} />
        </Card>
      )}
    </Pressable>
  );
}

function ContributionChart({ days }: { days: ContributionDay[] }) {
  const { t } = useAppLocale();
  const { width } = useWindowDimensions();
  const chartWidth = width - spacing.screenHorizontal * 2 - spacing.componentGap * 2;
  const cellSize = Math.max(14, Math.floor((chartWidth - chartGap * (chartColumns - 1)) / chartColumns));
  const visibleDays = days.slice(-30);
  const paddedDays = [
    ...Array.from({ length: Math.max(0, 30 - visibleDays.length) }, (_, index) => ({
      date: new Date(index),
      level: 0,
    })),
    ...visibleDays,
  ];

  return (
    <View style={{ gap: 12 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: chartGap }}>
        {paddedDays.map((item, index) => (
          <View
            key={`${item.date.toISOString()}-${index}`}
            style={{
              width: cellSize,
              height: cellSize,
              borderRadius: radius.input / 4,
              backgroundColor: contributionColor(item.level),
            }}
          />
        ))}
      </View>
      <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "flex-end", gap: 7 }}>
        <Text color="muted" variant="small" style={{ fontSize: 12, lineHeight: 16 }}>
          {t("patterns.less")}
        </Text>
        {[0, 1, 2, 3].map((level) => (
          <View
            key={level}
            style={{
              width: 10,
              height: 10,
              borderRadius: radius.pill,
              backgroundColor: contributionColor(level),
            }}
          />
        ))}
        <Text color="muted" variant="small" style={{ fontSize: 12, lineHeight: 16 }}>
          {t("patterns.more")}
        </Text>
      </View>
    </View>
  );
}

function contributionColor(level: number) {
  if (level <= 0) return "#EDEDEF";
  if (level === 1) return "#D9D9DE";
  if (level === 2) return colors.softText;
  return colors.foreground;
}
