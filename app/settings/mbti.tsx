import { router } from "expo-router";
import { View } from "react-native";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
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

export default function SettingsMbtiScreen() {
  const selectedMbti = useOnboardingStore((state) => state.selectedMbti);
  const setMbti = useOnboardingStore((state) => state.setMbti);

  const saveAndReturn = (value: string) => {
    setMbti(value);
    router.replace("/settings");
  };

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ gap: spacing.componentGap }}>
      <ScreenHeader title="MBTI" showBack />
      <View style={{ gap: spacing.smallGap }}>
        <Text variant="heading">Edit type.</Text>
        <Text variant="body" color="muted">
          Choose the type Noven should use for personalization.
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
              onPress={() => saveAndReturn(type)}
              style={{ minHeight: 44, width: "23%" }}
            />
          ))}
        </Chip.Group>
      </View>

      <Button label="I don't know yet" variant="secondary" onPress={() => saveAndReturn("Unknown")} />
    </Screen>
  );
}
