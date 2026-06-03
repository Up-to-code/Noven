import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { ChevronRight, Crown, FileText, Settings, Shield, Sparkles, User, Wand2, type LucideProps } from "lucide-react-native";
import type { ComponentType } from "react";

import { AvatarImage } from "@/components/ui/AvatarImage";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { useAppLocale } from "@/localization";
import { playFeedback } from "@/lib/feedback";
import { useHabitStore } from "@/store/habitStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";

export default function ProfileScreen() {
  const { t } = useAppLocale();
  const name = useOnboardingStore((state) => state.name);
  const avatarId = useOnboardingStore((state) => state.avatarId);
  const selectedMbti = useOnboardingStore((state) => state.selectedMbti);
  const habits = useHabitStore((state) => state.habits);
  const isPremium = useSubscriptionStore((state) => state.isPremium);

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ gap: spacing.sectionGap }}>
      <ScreenHeader showSettings />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.smallGap + spacing.compact,
          paddingTop: spacing.smallGap,
        }}
      >
        <Pressable
          onPress={() => {
            playFeedback("select");
            router.push("/profile/avatar");
          }}
          style={({ pressed }) => ({
            opacity: pressed ? 0.72 : 1,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          })}
        >
          <AvatarImage id={avatarId} size={84} />
        </Pressable>

        <View style={{ flex: 1, minHeight: 84, justifyContent: "center", gap: spacing.compact }}>
          <Text
            variant="caption"
            style={{
              fontSize: 10,
              lineHeight: 14,
              letterSpacing: 1.6,
            }}
          >
            {selectedMbti || t("profile.profile")}
          </Text>
          <Text
            variant="heading"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.78}
            style={{
              fontSize: 27,
              lineHeight: 34,
            }}
          >
            {name || t("profile.yourProfile")}
          </Text>
          <View
            style={{
              alignSelf: "flex-start",
              borderRadius: radius.pill,
              backgroundColor: colors.surface,
              paddingHorizontal: spacing.smallGap + spacing.compact,
              paddingVertical: spacing.compact,
            }}
          >
            <Text
              variant="small"
              color="muted"
              style={{
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              {t("profile.habitCount", { count: habits.length })}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          overflow: "hidden",
          borderRadius: radius.input,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        <ProfileAction icon={Wand2} label={t("profile.editAvatar")} onPress={() => router.push("/profile/avatar")} />
        <ProfileAction icon={User} label={t("profile.editName")} onPress={() => router.push("/settings/name")} showDivider />
        <ProfileAction icon={Sparkles} label={t("profile.editType")} onPress={() => router.push("/settings/mbti")} showDivider />
        <ProfileAction
          icon={Crown}
          label={isPremium ? t("profile.manageSubscription") : t("profile.upgradePremium")}
          onPress={() =>
            router.push({
              pathname: "/paywall",
              params: {
                placement: "settings",
                returnTo: "/(tabs)/profile",
              },
            })
          }
          showDivider
        />
        <ProfileAction icon={FileText} label={t("common.terms")} onPress={() => router.push("/legal/terms")} showDivider />
        <ProfileAction icon={Shield} label={t("common.privacyPolicy")} onPress={() => router.push("/legal/privacy")} showDivider />
        <ProfileAction icon={Settings} label={t("profile.allSettings")} onPress={() => router.push("/settings")} showDivider />
      </View>
    </Screen>
  );
}

function ProfileAction({
  icon: Icon,
  label,
  onPress,
  showDivider = false,
}: {
  icon: ComponentType<LucideProps>;
  label: string;
  onPress: () => void;
  showDivider?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        playFeedback("select");
        onPress();
      }}
      style={({ pressed }) => ({
        minHeight: 46,
        alignItems: "center",
        flexDirection: "row",
        gap: spacing.smallGap + spacing.compact,
        paddingHorizontal: spacing.componentGap,
        borderTopWidth: showDivider ? 1 : 0,
        borderTopColor: colors.border,
        backgroundColor: pressed ? colors.surface : colors.background,
        opacity: pressed ? 0.72 : 1,
      })}
    >
      <Icon color={colors.foreground} size={17} strokeWidth={1.7} />
      <Text variant="small" style={{ flex: 1 }}>
        {label}
      </Text>
      <ChevronRight color={colors.softText} size={16} strokeWidth={1.7} />
    </Pressable>
  );
}
