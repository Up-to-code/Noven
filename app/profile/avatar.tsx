import { router } from "expo-router";

import { AvatarPickerGrid } from "@/components/ui/AvatarPickerGrid";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";
import { resolveAvatarId } from "@/content/avatars";
import { useOnboardingStore } from "@/store/onboardingStore";

export default function AvatarPickerScreen() {
  const avatarId = useOnboardingStore((state) => state.avatarId);
  const setAvatar = useOnboardingStore((state) => state.setAvatar);
  const selectedAvatarId = resolveAvatarId(avatarId);

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ gap: spacing.sectionGap }}>
      <ScreenHeader title="Avatar" showBack />
      <Screen.Section style={{ gap: spacing.smallGap }}>
        <Text variant="caption">PROFILE STYLE</Text>
        <Text variant="heading">Choose your mark</Text>
        <Text variant="small" color="muted">
          Monochrome avatars keep Noven quiet while giving your system a little personality.
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
