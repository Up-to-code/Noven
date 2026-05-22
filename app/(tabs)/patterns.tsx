import { Pressable, View } from "react-native";
import { router } from "expo-router";

import { AddHabitGlyph } from "@/components/ui/AddHabitGlyph";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { completionSummary, heatmapDaysFromStart } from "@/lib/habitAnalytics";
import { useHabitStore } from "@/store/habitStore";
import { usePreferenceStore } from "@/store/preferenceStore";
import type { Habit } from "@/types";

type ContributionDay = {
  date: Date;
  level: number;
};

export default function PatternsScreen() {
  const habits = useHabitStore((state) => state.habits);
  const habitLogs = useHabitStore((state) => state.habitLogs);
  const analyticsRangeDays = usePreferenceStore((state) => state.analyticsRangeDays);

  return (
    <Screen scroll={habits.length > 0} topPadding={spacing.smallGap} contentStyle={{ gap: spacing.componentGap }}>
      <ScreenHeader showSettings />
      <View style={{ gap: spacing.smallGap }}>
        <Text variant="caption">ANALYTICS</Text>
        <View style={{ flex: 1 }}>
          <Text variant="heading">Patterns</Text>
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
          <AddHabitGlyph label="Add your first habit" onPress={() => router.push("/habits/create")} />
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

  return (
    <Pressable onPress={() => router.push(`/habits/${habit.id}`)}>
      {({ pressed }) => (
        <Card variant="surface" style={{ gap: spacing.componentGap, opacity: pressed ? 0.82 : 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.componentGap }}>
            <View style={{ flex: 1, gap: spacing.compact }}>
              <Text variant="body" numberOfLines={1}>
                {habit.title}
              </Text>
              <Text variant="small" color="muted">
                {habit.category} · {analyticsRangeDays} days
              </Text>
            </View>
            <Text variant="body">{Math.round(summary.rate * 100)}%</Text>
          </View>
          <ContributionStrip days={days} />
        </Card>
      )}
    </Pressable>
  );
}

function ContributionStrip({ days }: { days: ContributionDay[] }) {
  const visibleDays = days.slice(-35);
  const columns = Array.from({ length: Math.ceil(visibleDays.length / 7) }, (_, index) =>
    visibleDays.slice(index * 7, index * 7 + 7),
  );

  return (
    <View
      style={{
        alignSelf: "flex-start",
        flexDirection: "row",
        gap: spacing.compact,
      }}
    >
      {columns.map((column, columnIndex) => (
        <View key={columnIndex} style={{ gap: spacing.compact }}>
          {column.map((item) => (
            <View
              key={item.date.toISOString()}
              style={{
                width: 11,
                height: 11,
                borderRadius: radius.input / 5,
                backgroundColor: contributionColor(item.level),
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}


function contributionColor(level: number) {
  if (level <= 0) return "#EDEDEF";
  if (level === 1) return "#D9D9DE";
  if (level === 2) return colors.softText;
  return colors.foreground;
}
