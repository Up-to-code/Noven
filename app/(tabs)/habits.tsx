import { Plus } from "lucide-react-native";
import { router } from "expo-router";

import { AddHabitGlyph } from "@/components/ui/AddHabitGlyph";
import { Button } from "@/components/ui/Button";
import { HabitRow } from "@/components/ui/HabitRow";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenIntro } from "@/components/ui/ScreenIntro";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";
import { useHabitStore } from "@/store/habitStore";

export default function HabitsScreen() {
  const habits = useHabitStore((state) => state.habits);

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ gap: spacing.componentGap }}>
      <ScreenHeader showSettings />
      <ScreenIntro
        title="Habits"
        subtitle="Small routines for the system you are building."
        variant="heading"
      />

      {habits.length ? (
        <>
          <Button
            label="Create habit"
            icon={Plus}
            feedback="add"
            onPress={() => router.push("/habits/create")}
          />
          <Button
            label="Discover habits"
            variant="secondary"
            onPress={() => router.push("/habits/discovery")}
          />
        </>
      ) : null}

      {habits.length ? (
        <Screen.Section style={{ marginTop: spacing.smallGap }}>
          <Text variant="caption" color="muted">
            ACTIVE SYSTEM
          </Text>
          {habits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} onPress={() => router.push(`/habits/${habit.id}`)} />
          ))}
        </Screen.Section>
      ) : (
        <AddHabitGlyph label="Add your first habit" onPress={() => router.push("/habits/create")} />
      )}
    </Screen>
  );
}
