import { router } from "expo-router";
import { useWindowDimensions, View } from "react-native";

import { ActionPanel } from "@/components/ui/ActionPanel";
import { Button } from "@/components/ui/Button";
import { Illustration } from "@/components/ui/Illustration";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { futureTitle } from "@/content/personalization";
import { spacing } from "@/design/spacing";
import { useOnboardingStore } from "@/store/onboardingStore";

export default function FutureSystemScreen() {
  const { height } = useWindowDimensions();
  const name = useOnboardingStore((state) => state.name);
  const selectedFocus = useOnboardingStore((state) => state.selectedFocus);
  const illustrationHeight = Math.min(Math.max(height * 0.39, 312), 370);

  return (
    <Screen
      scroll={false}
      topPadding={spacing.smallGap}
      contentStyle={{
        gap: 12,
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <ScreenHeader showBack />

      <View style={{ gap: spacing.smallGap }}>
        <Text
          variant="heading"
          style={{
            maxWidth: 320,
          }}
        >
          {futureTitle(name)}{"\n"}Your life.
        </Text>
        <Text
          variant="body"
          color="muted"
          style={{
            fontSize: 16,
            lineHeight: 23,
            maxWidth: 310,
          }}
        >
          {selectedFocus
            ? `Let's build around ${selectedFocus.toLowerCase()}.`
            : "Let's build a system that truly fits you."}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginTop: spacing.componentGap,
        }}
      >
        <Illustration
          asset="standing_future_character"
          contentFit="contain"
          mode="full"
          opacity={1}
          style={{
            height: illustrationHeight,
            width: "112%",
            maxWidth: 390,
          }}
        />
      </View>

      <ActionPanel>
        <Button
          label="Let's Begin"
          onPress={() =>
            router.replace({
              pathname: "/paywall",
              params: {
                placement: "onboarding",
                returnTo: "/(tabs)",
              },
            })
          }
        />
      </ActionPanel>
    </Screen>
  );
}
