import { router } from "expo-router";
import { View } from "react-native";

import { ActionPanel } from "@/components/ui/ActionPanel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { aboutSubtitle, firstName } from "@/content/personalization";
import { spacing } from "@/design/spacing";
import { useOnboardingStore } from "@/store/onboardingStore";

const features = [
  ["Personalized", "Built around how your mind works."],
  ["Adaptive", "Changes as your habits evolve."],
  ["Minimal", "Clarity over complexity."],
];

export default function AboutNovenScreen() {
  const name = useOnboardingStore((state) => state.name);
  const selectedMbti = useOnboardingStore((state) => state.selectedMbti);
  const selectedFocus = useOnboardingStore((state) => state.selectedFocus);
  const resolvedName = firstName(name);

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
          {resolvedName ? `Here's your Noven, ${resolvedName}.` : "Here's what Noven is."}
        </Text>
        <Text variant="body" color="muted" style={{ maxWidth: 310 }}>
          {aboutSubtitle(selectedMbti, selectedFocus)}
        </Text>
      </View>

      <View style={{ gap: spacing.smallGap }}>
        {features.map(([title, description]) => (
          <Card key={title} variant="outline">
            <Text variant="body">{title}</Text>
            <Text variant="small" color="muted">
              {description}
            </Text>
          </Card>
        ))}
      </View>

      <ActionPanel style={{ marginTop: "auto" }}>
        <Button label="Continue" onPress={() => router.push("/onboarding/future")} />
      </ActionPanel>
    </Screen>
  );
}
