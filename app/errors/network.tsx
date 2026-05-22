import { router } from "expo-router";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";

export default function LocalErrorScreen() {
  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ justifyContent: "space-between" }}>
      <Screen.Section>
        <ScreenHeader showBack />
        <Text variant="heading">Something paused</Text>
        <Text variant="body" color="muted" style={{ marginTop: spacing.smallGap }}>
          Go back and try the previous step again.
        </Text>
      </Screen.Section>
      <Button label="Try Again" onPress={() => router.back()} />
    </Screen>
  );
}
