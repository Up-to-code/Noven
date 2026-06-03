import { Check } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { router } from "expo-router";

import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { setAppLocale, useAppLocale, type SupportedLocale } from "@/localization";
import { usePreferenceStore } from "@/store/preferenceStore";

type LanguageOption = {
  locale: SupportedLocale;
  labelKey: string;
  nativeName: string;
};

const languageGroups: Array<{
  titleKey: string;
  options: LanguageOption[];
}> = [
  {
    titleKey: "settings.language.groups.device",
    options: [{ locale: "system", labelKey: "settings.language.system", nativeName: "Auto" }],
  },
  {
    titleKey: "settings.language.groups.asia",
    options: [{ locale: "ja-JP", labelKey: "settings.language.jaJP", nativeName: "日本語" }],
  },
  {
    titleKey: "settings.language.groups.europe",
    options: [
      { locale: "en-GB", labelKey: "settings.language.enGB", nativeName: "English" },
      { locale: "fr-FR", labelKey: "settings.language.frFR", nativeName: "Français" },
      { locale: "fr-CH", labelKey: "settings.language.frCH", nativeName: "Français" },
      { locale: "it-IT", labelKey: "settings.language.itIT", nativeName: "Italiano" },
      { locale: "pt-PT", labelKey: "settings.language.ptPT", nativeName: "Português" },
    ],
  },
  {
    titleKey: "settings.language.groups.americas",
    options: [
      { locale: "en-US", labelKey: "settings.language.enUS", nativeName: "English" },
      { locale: "pt-BR", labelKey: "settings.language.ptBR", nativeName: "Português" },
    ],
  },
];

export default function SettingsLanguageScreen() {
  const { t } = useAppLocale();
  const languageOverride = usePreferenceStore((state) => state.languageOverride);
  const setLanguageOverride = usePreferenceStore((state) => state.setLanguageOverride);

  const chooseLanguage = (locale: SupportedLocale) => {
    setLanguageOverride(locale);
    setAppLocale(locale).catch(console.error);
    router.replace("/settings");
  };

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ gap: spacing.componentGap }}>
      <ScreenHeader title={t("settings.language.row")} showBack />

      <View style={{ gap: spacing.smallGap }}>
        <Text variant="heading">{t("settings.language.title")}</Text>
        <Text color="muted" variant="body">
          {t("settings.language.subtitle")}
        </Text>
      </View>

      <View style={{ gap: spacing.componentGap }}>
        {languageGroups.map((group) => (
          <View key={group.titleKey} style={{ gap: spacing.smallGap }}>
            <Text color="soft" variant="caption">
              {t(group.titleKey)}
            </Text>
            <View
              style={{
                borderRadius: radius.input,
                borderCurve: "continuous",
                borderWidth: 1,
                borderColor: colors.border,
                overflow: "hidden",
              }}
            >
              {group.options.map((option, index) => (
                <LanguageRow
                  key={option.locale}
                  label={t(option.labelKey)}
                  nativeName={option.nativeName}
                  selected={languageOverride === option.locale}
                  showDivider={index < group.options.length - 1}
                  onPress={() => chooseLanguage(option.locale)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

function LanguageRow({
  label,
  nativeName,
  onPress,
  selected,
  showDivider,
}: {
  label: string;
  nativeName: string;
  onPress: () => void;
  selected: boolean;
  showDivider: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 62,
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.componentGap,
        backgroundColor: pressed ? colors.surface : colors.background,
        borderBottomWidth: showDivider ? 1 : 0,
        borderBottomColor: colors.border,
        paddingHorizontal: spacing.componentGap,
        paddingVertical: spacing.smallGap,
      })}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text variant="body">{nativeName}</Text>
        <Text color="muted" variant="small">
          {label}
        </Text>
      </View>
      <View
        style={{
          width: 28,
          height: 28,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radius.pill,
          backgroundColor: selected ? colors.foreground : colors.surface,
        }}
      >
        {selected ? <Check color={colors.background} size={16} strokeWidth={2.1} /> : null}
      </View>
    </Pressable>
  );
}
