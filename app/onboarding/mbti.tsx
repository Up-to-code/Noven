import { router } from "expo-router";
import { View } from "react-native";

import { ActionPanel } from "@/components/ui/ActionPanel";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { namePrefix } from "@/content/personalization";
import { spacing } from "@/design/spacing";
import { useOnboardingStore } from "@/store/onboardingStore";

const mbtiTypes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
];

export default function MbtiSelectionScreen() {
  const name = useOnboardingStore((state) => state.name);
  const selectedMbti = useOnboardingStore((state) => state.selectedMbti);
  const setMbti = useOnboardingStore((state) => state.setMbti);

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
        <Text variant="heading" style={{ maxWidth: 310 }}>
          {namePrefix(name)}what's your MBTI type?
        </Text>
        <Text variant="body" color="muted" style={{ maxWidth: 300 }}>
          This helps personalize your system.
        </Text>
      </View>

      <View style={{ gap: spacing.componentGap }}>
        <Text variant="caption" color="soft">
          SELECT ONE
        </Text>
        <Chip.Group style={{ justifyContent: "space-between", rowGap: spacing.smallGap }}>
          {mbtiTypes.map((type) => (
            <Chip
              key={type}
              label={type}
              selected={selectedMbti === type}
              onPress={() => setMbti(type)}
              style={{
                width: "23%",
                minHeight: 44,
              }}
            />
          ))}
        </Chip.Group>
      </View>

      <ActionPanel style={{ marginTop: "auto" }}>
        <Button
          label="I don't know yet"
          variant="ghost"
          style={{ minHeight: 44 }}
          onPress={() => {
            setMbti("Unknown");
            router.push("/onboarding/focus");
          }}
        />
        <Button
          label="Continue"
          disabled={!selectedMbti}
          onPress={() => router.push("/onboarding/focus")}
        />
      </ActionPanel>
    </Screen>
  );
}
