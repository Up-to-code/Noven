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
import { useHabitCreationGate } from "@/hooks/useHabitCreationGate";
import { useAppLocale } from "@/localization";
import { useHabitStore } from "@/store/habitStore";

export default function HabitsScreen() {
  const { t } = useAppLocale();
  const habits = useHabitStore((state) => state.habits);
  const openCreateHabit = useHabitCreationGate("/(tabs)/habits");

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ gap: spacing.componentGap }}>
      <ScreenHeader showSettings />
      <ScreenIntro
        title={t("habits.title")}
        subtitle={t("habits.subtitle")}
        variant="heading"
      />

      {habits.length ? (
        <>
          <Button
            label={t("common.createHabit")}
            icon={Plus}
            feedback="add"
            onPress={openCreateHabit}
          />
          <Button
            label={t("common.discoverHabits")}
            variant="secondary"
            onPress={() => router.push("/habits/discovery")}
          />
        </>
      ) : null}

      {habits.length ? (
        <Screen.Section style={{ marginTop: spacing.smallGap }}>
          <Text variant="caption" color="muted">
            {t("habits.activeSystem")}
          </Text>
          {habits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} onPress={() => router.push(`/habits/${habit.id}`)} />
          ))}
        </Screen.Section>
      ) : (
        <AddHabitGlyph label={t("habits.addFirstHabit")} onPress={openCreateHabit} />
      )}
    </Screen>
  );
}
