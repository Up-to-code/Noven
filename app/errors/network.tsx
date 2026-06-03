import { router } from "expo-router";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";
import { useAppLocale } from "@/localization";

export default function LocalErrorScreen() {
  const { t } = useAppLocale();

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ justifyContent: "space-between" }}>
      <Screen.Section>
        <ScreenHeader showBack />
        <Text variant="heading">{t("error.paused")}</Text>
        <Text variant="body" color="muted" style={{ marginTop: spacing.smallGap }}>
          {t("error.pausedBody")}
        </Text>
      </Screen.Section>
      <Button label={t("error.tryAgain")} onPress={() => router.back()} />
    </Screen>
  );
}
