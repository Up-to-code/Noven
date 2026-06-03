import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenIntro } from "@/components/ui/ScreenIntro";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";
import { useCanCreateHabit, useHabitCreationGate } from "@/hooks/useHabitCreationGate";
import { useAppLocale } from "@/localization";
import { useHabitStore } from "@/store/habitStore";

const categories = ["Focus", "Mind", "Energy", "Routine"];

export default function HabitDiscoveryScreen() {
  const { t } = useAppLocale();
  const addHabit = useHabitStore((state) => state.addHabit);
  const recommendedHabits = useHabitStore((state) => state.recommendedHabits);
  const canCreateHabit = useCanCreateHabit();
  const openCreateHabit = useHabitCreationGate("/habits/discovery");
  const [selectedCategory, setSelectedCategory] = useState("Focus");
  const habits = recommendedHabits.filter((habit) => habit.category === selectedCategory);

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ gap: spacing.componentGap }}>
      <ScreenHeader title={t("habits.title")} showBack />
      <ScreenIntro
        title={t("habits.discoverTitle")}
        subtitle={t("habits.discoverSubtitle")}
        variant="heading"
      />
      <Chip.Group>
        {categories.map((category) => (
          <Chip
            key={category}
            label={t(`categories.${category}`)}
            selected={category === selectedCategory}
            onPress={() => setSelectedCategory(category)}
          />
        ))}
      </Chip.Group>

      <Screen.Section>
        {habits.map((habit) => (
          <Card key={habit.id} variant="outline">
            <Text variant="body">{habit.title}</Text>
            <Text variant="small" color="muted">
              {habit.description}
            </Text>
            <Button
              label={t("habits.addHabit")}
              icon={Plus}
              variant="secondary"
              onPress={() => {
                if (!canCreateHabit) {
                  router.push({
                    pathname: "/paywall",
                    params: {
                      placement: "settings",
                      returnTo: "/habits/discovery",
                    },
                  });
                  return;
                }

                addHabit({
                  ...habit,
                  id: `${habit.id}-${Date.now()}`,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                });
                router.push("/habits/setup-complete");
              }}
              style={{ marginTop: spacing.componentGap }}
            />
          </Card>
        ))}
        {!habits.length ? (
          <Card variant="surface">
            <Text variant="body">{t("habits.noRecommendations")}</Text>
            <Text variant="small" color="muted">
              {t("habits.noRecommendationsBody")}
            </Text>
            <Button
              label={t("common.createHabit")}
              icon={Plus}
              variant="secondary"
              onPress={openCreateHabit}
              style={{ marginTop: spacing.componentGap }}
            />
          </Card>
        ) : null}
      </Screen.Section>
    </Screen>
  );
}
