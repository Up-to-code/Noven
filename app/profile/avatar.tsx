import { router } from "expo-router";

import { AvatarPickerGrid } from "@/components/ui/AvatarPickerGrid";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";
import { useAppLocale } from "@/localization";
import { resolveAvatarId } from "@/content/avatars";
import { useOnboardingStore } from "@/store/onboardingStore";

export default function AvatarPickerScreen() {
  const { t } = useAppLocale();
  const avatarId = useOnboardingStore((state) => state.avatarId);
  const setAvatar = useOnboardingStore((state) => state.setAvatar);
  const selectedAvatarId = resolveAvatarId(avatarId);

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ gap: spacing.sectionGap }}>
      <ScreenHeader title={t("profile.avatarTitle")} showBack />
      <Screen.Section style={{ gap: spacing.smallGap }}>
        <Text variant="caption">{t("profile.profileStyle")}</Text>
        <Text variant="heading">{t("profile.chooseMark")}</Text>
        <Text variant="small" color="muted">
          {t("profile.avatarSubtitle")}
        </Text>
      </Screen.Section>
      <AvatarPickerGrid
        selectedAvatarId={selectedAvatarId}
        onSelect={(nextAvatarId) => {
          setAvatar(nextAvatarId);
          router.back();
        }}
      />
    </Screen>
  );
}
