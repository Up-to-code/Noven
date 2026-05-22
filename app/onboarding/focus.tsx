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
import { useOnboardingStore } from "@/store/onboardingStore";

const focusOptions = [
  "Better focus",
  "Consistency",
  "Mental clarity",
  "Routine building",
  "Energy balance",
  "Deep work",
];

export default function FocusSelectionScreen() {
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
          Choose what matters most right now.
        </Text>
      </View>

      <View style={{ gap: spacing.componentGap }}>
        <Text variant="caption" color="soft">
          SELECT ONE
        </Text>
        <Chip.Group style={{ rowGap: spacing.smallGap }}>
          {focusOptions.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={selectedFocus === option}
              onPress={() => setFocus(option)}
              style={{
                minHeight: 44,
                paddingHorizontal: spacing.componentGap,
              }}
            />
          ))}
          <Chip
            label="Custom"
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
          label="Continue"
          disabled={!selectedFocus}
          onPress={() => router.push("/onboarding/about")}
        />
      </ActionPanel>
    </Screen>
  );
}
