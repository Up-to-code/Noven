import { router } from "expo-router";
import { View } from "react-native";

import { ActionPanel } from "@/components/ui/ActionPanel";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { focusPrompt } from "@/content/personalization";
import { spacing } from "@/design/spacing";
import { useAppLocale } from "@/localization";
import { useOnboardingStore } from "@/store/onboardingStore";

const focusOptions = [
  "focusOptions.betterFocus",
  "focusOptions.consistency",
  "focusOptions.mentalClarity",
  "focusOptions.routineBuilding",
  "focusOptions.energyBalance",
  "focusOptions.deepWork",
];

export default function FocusSelectionScreen() {
  const { t } = useAppLocale();
  const name = useOnboardingStore((state) => state.name);
  const selectedFocus = useOnboardingStore((state) => state.selectedFocus);
  const setFocus = useOnboardingStore((state) => state.setFocus);

  return (
    <Screen
      scroll
      topPadding={spacing.smallGap}
      contentStyle={{
        gap: spacing.componentGap,
      }}
    >
      <ScreenHeader showBack />

      <View style={{ gap: spacing.smallGap }}>
        <Text variant="heading" style={{ maxWidth: 320 }}>
          {focusPrompt(name)}
        </Text>
        <Text variant="body" color="muted" style={{ maxWidth: 300 }}>
          {t("onboarding.focusSubtitle")}
        </Text>
      </View>

      <View style={{ gap: spacing.componentGap }}>
        <Text variant="caption" color="soft">
          {t("onboarding.selectOne")}
        </Text>
        <Chip.Group style={{ rowGap: spacing.smallGap }}>
          {focusOptions.map((option) => (
            <Chip
              key={option}
              label={t(option)}
              selected={selectedFocus === t(option)}
              onPress={() => setFocus(t(option))}
              style={{
                minHeight: 44,
                paddingHorizontal: spacing.componentGap,
              }}
            />
          ))}
          <Chip
            label={t("focusOptions.custom")}
            selected={false}
            onPress={() => router.push("/onboarding/custom-focus")}
            style={{
              minHeight: 44,
              paddingHorizontal: spacing.componentGap,
            }}
          />
        </Chip.Group>
      </View>

      <ActionPanel style={{ marginTop: "auto" }}>
        <Button
          label={t("common.continue")}
          disabled={!selectedFocus}
          onPress={() => router.push("/onboarding/about")}
        />
      </ActionPanel>
    </Screen>
  );
}
