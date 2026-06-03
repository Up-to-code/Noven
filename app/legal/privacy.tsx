import { View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenIntro } from "@/components/ui/ScreenIntro";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";
import { useAppLocale } from "@/localization";

const sections = [
  ["legal.sections.localData", "legal.sections.localDataBody"],
  ["legal.sections.purchases", "legal.sections.purchasesBody"],
  ["legal.sections.exports", "legal.sections.exportsBody"],
];

export default function PrivacyScreen() {
  const { t } = useAppLocale();

  return (
    <Screen contentStyle={{ gap: spacing.sectionGap }}>
      <ScreenHeader title={t("legal.privacyTitle")} showBack />
      <ScreenIntro
        title={t("legal.privacyHeading")}
        subtitle={t("legal.privacySubtitle")}
        variant="heading"
      />

      <View style={{ gap: spacing.componentGap }}>
        {sections.map(([title, body]) => (
          <View key={title} style={{ gap: spacing.smallGap }}>
            <Text variant="caption">{t(title).toUpperCase()}</Text>
            <Text color="muted" variant="body">
              {t(body)}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
