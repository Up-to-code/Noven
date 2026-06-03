import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActionPanel } from "@/components/ui/ActionPanel";
import { Button } from "@/components/ui/Button";
import { Illustration } from "@/components/ui/Illustration";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { spacing } from "@/design/spacing";
import { useAppLocale } from "@/localization";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useAppLocale();

  return (
    <Screen
      scroll={false}
      contentStyle={{
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <View style={{ paddingTop: spacing.smallGap }}>
        <Text
          variant="display"
          style={{
            maxWidth: 320,
            fontSize: 32,
            lineHeight: 40,
            textAlign: "left",
          }}
        >
          {t("onboarding.welcomeTitle")}
        </Text>
        <Text
          variant="body"
          color="muted"
          style={{
            maxWidth: 286,
            fontSize: 16,
            lineHeight: 23,
            marginTop: spacing.smallGap,
            textAlign: "left",
          }}
        >
          {t("onboarding.welcomeSubtitle")}
        </Text>
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Illustration
          asset="welcome_reflection_wide"
          contentFit="contain"
          mode="full"
          opacity={1}
          style={{
            width: "100%",
            maxWidth: 342,
            height: 304,
          }}
        />
      </View>

      <ActionPanel style={{ paddingBottom: Math.max(insets.bottom, spacing.smallGap) }}>
        <View style={{ gap: spacing.smallGap }}>
          <Button
            label={t("common.continue")}
            right={<ArrowRight color={colors.background} size={24} strokeWidth={1.8} />}
            onPress={() => router.push("/onboarding/name")}
            style={{
              minHeight: 50,
              borderRadius: 14,
            }}
          />
          <LegalNotice />
        </View>
      </ActionPanel>
    </Screen>
  );
}

function LegalNotice() {
  const { t } = useAppLocale();

  return (
    <View
      style={{
        alignItems: "center",
        gap: spacing.compact,
        paddingHorizontal: spacing.componentGap,
        paddingTop: spacing.compact,
      }}
    >
      <Text
        color="muted"
        variant="small"
        style={{
          fontSize: 12,
          lineHeight: 17,
          textAlign: "center",
        }}
      >
        {t("onboarding.legalNotice")}
      </Text>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          columnGap: spacing.componentGap,
          rowGap: 0,
          justifyContent: "center",
        }}
      >
        <InlineLink label={t("common.terms")} href="/legal/terms" />
        <InlineLink label={t("common.privacyPolicy")} href="/legal/privacy" />
      </View>
    </View>
  );
}

function InlineLink({ href, label }: { href: string; label: string }) {
  return (
    <Pressable
      hitSlop={10}
      onPress={() => router.push(href)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.64 : 1,
        paddingVertical: 2,
      })}
    >
      <Text
        variant="small"
        style={{
          color: colors.foreground,
          fontFamily: "Inter SemiBold",
          fontSize: 12,
          lineHeight: 16,
          textDecorationLine: "underline",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
