import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { ChevronRight, Plus, Sparkles } from "lucide-react-native";

import { AddHabitGlyph } from "@/components/ui/AddHabitGlyph";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HabitRow } from "@/components/ui/HabitRow";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { homeInsight } from "@/content/personalization";
import { isCompletedToday } from "@/lib/habitAnalytics";
import { useHabitStore } from "@/store/habitStore";
import { useOnboardingStore } from "@/store/onboardingStore";

export default function HomeScreen() {
  const name = useOnboardingStore((state) => state.name);
  const mbti = useOnboardingStore((state) => state.selectedMbti);
  const focus = useOnboardingStore((state) => state.selectedFocus);
  const habits = useHabitStore((state) => state.habits);
  const habitLogs = useHabitStore((state) => state.habitLogs);
  const firstName = name.trim().split(/\s+/)[0] || "there";
  const nextHabit = habits.find((habit) => !isCompletedToday(habitLogs, habit.id)) || habits[0];
  const completedToday = habits.filter((habit) => isCompletedToday(habitLogs, habit.id)).length;
  const progress = habits.length ? completedToday / habits.length : 0;
  const focusText = nextHabit
    ? nextHabit.title
    : focus
      ? focus
      : "Create one habit";

  return (
    <Screen topPadding={0} contentStyle={{ gap: spacing.componentGap }}>
      <ScreenHeader showSettings />

      <View style={{ gap: spacing.smallGap }}>
        <Text variant="caption">{mbti || "PERSONAL SYSTEM"}</Text>
        <Text
          variant="heading"
          style={{
            fontSize: 27,
            lineHeight: 35,
          }}
        >
          Good evening, {firstName}.
        </Text>
        <Text color="muted" variant="body">
          {homeInsight(mbti, focus)}
        </Text>
      </View>

      <Card variant="plain" style={{ gap: spacing.componentGap, paddingHorizontal: 0, paddingVertical: spacing.smallGap }}>
        <View style={{ gap: spacing.smallGap }}>
          <Text variant="caption">TODAY PROGRESS</Text>
          <Text variant="body">{focusText}</Text>
        </View>
        <ProgressBlocks value={progress} />
      </Card>

      <Pressable onPress={() => router.push("/mbti-insights")}>
        {({ pressed }) => (
          <Card
            variant="outline"
            style={{
              opacity: pressed ? 0.75 : 1,
              gap: spacing.smallGap,
              padding: spacing.componentGap,
            }}
          >
            <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.smallGap }}>
              <Sparkles color={colors.foreground} size={18} strokeWidth={1.6} />
              <Text variant="small" style={{ flex: 1, fontFamily: "Inter SemiBold" }}>
                Export prompt
              </Text>
              <ChevronRight color={colors.softText} size={18} strokeWidth={1.6} />
            </View>
          </Card>
        )}
      </Pressable>

      <View style={{ gap: spacing.componentGap }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text variant="caption">ADAPTIVE HABITS</Text>
          <Button
            icon={Plus}
            label="Add"
            onPress={() => router.push("/habits/discovery")}
            feedback="add"
            variant="ghost"
            style={{
              minHeight: spacing.touch - spacing.componentGap,
              paddingHorizontal: 0,
            }}
          />
        </View>
        {habits.slice(0, 3).map((habit) => (
          <HabitRow key={habit.id} habit={habit} onPress={() => router.push(`/habits/${habit.id}`)} />
        ))}
        {!habits.length ? (
          <AddHabitGlyph label="Add first habit" onPress={() => router.push("/habits/create")} />
        ) : null}
      </View>
    </Screen>
  );
}

function ProgressBlocks({ value }: { value: number }) {
  const progress = Math.max(0, Math.min(1, value));
  const blockCount = 4;

  return (
    <View
      style={{
        flexDirection: "row",
        gap: spacing.smallGap,
      }}
    >
      {Array.from({ length: blockCount }, (_, index) => {
        const fill = Math.max(0, Math.min(1, progress * blockCount - index));

        return (
          <View
            key={index}
            style={{
              flex: 1,
              height: 18,
              borderRadius: radius.input / 3,
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderWidth: 1,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${fill * 100}%`,
                height: "100%",
                backgroundColor: colors.foreground,
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
