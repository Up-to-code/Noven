import { Linking, Pressable, View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenIntro } from "@/components/ui/ScreenIntro";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";
import { colors } from "@/design/colors";
import { useAppLocale } from "@/localization";

const sections = [
  ["legal.sections.personalUse", "legal.sections.personalUseBody"],
  ["legal.sections.purchases", "legal.sections.purchasesBody"],
  ["legal.sections.exports", "legal.sections.exportsBody"],
  ["legal.sections.responsibility", "legal.sections.responsibilityBody"],
  ["legal.sections.localData", "legal.sections.localDataBody"],
  ["legal.sections.appleEula", "legal.sections.appleEulaBody"],
  ["legal.sections.changes", "legal.sections.changesBody"],
];

const appleEulaUrl = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

export default function TermsScreen() {
  const { t } = useAppLocale();

  return (
    <Screen contentStyle={{ gap: spacing.sectionGap }}>
      <ScreenHeader title={t("legal.termsTitle")} showBack />
      <ScreenIntro
        title={t("legal.termsHeading")}
        subtitle={t("legal.termsSubtitle")}
        variant="heading"
      />

      <View style={{ gap: spacing.componentGap }}>
        {sections.map(([title, body]) => (
          <View key={title} style={{ gap: spacing.smallGap }}>
            <Text variant="caption">{t(title).toUpperCase()}</Text>
            <Text color="muted" variant="body">
              {t(body)}
            </Text>
            {title === "legal.sections.appleEula" ? (
              <Pressable hitSlop={8} onPress={() => Linking.openURL(appleEulaUrl)}>
                {({ pressed }) => (
                  <Text
                    variant="small"
                    style={{
                      color: colors.foreground,
                      fontFamily: "Inter SemiBold",
                      opacity: pressed ? 0.62 : 1,
                      textDecorationLine: "underline",
                    }}
                  >
                    {appleEulaUrl}
                  </Text>
                )}
              </Pressable>
            ) : null}
          </View>
        ))}
      </View>
    </Screen>
  );
}
