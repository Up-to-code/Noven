import { I18nManager, Pressable, View, type ViewProps } from "react-native";
import { router } from "expo-router";
import { ChevronLeft, Plus } from "lucide-react-native";

import { AvatarImage } from "@/components/ui/AvatarImage";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { playFeedback } from "@/lib/feedback";
import { useOnboardingStore } from "@/store/onboardingStore";

type ScreenHeaderProps = ViewProps & {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
};

export function ScreenHeader({ showBack = false, showSettings = false, style, title, ...props }: ScreenHeaderProps) {
  const avatarId = useOnboardingStore((state) => state.avatarId);
  const leadingAction = I18nManager.isRTL ? "avatar" : "add";
  const trailingAction = I18nManager.isRTL ? "add" : "avatar";

  return (
    <View
      {...props}
      style={[
        {
          minHeight: 42,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        style,
      ]}
    >
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 42,
            height: 42,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: radius.pill,
            borderWidth: 1,
            borderColor: colors.border,
            borderCurve: "continuous",
          }}
        >
          <ChevronLeft color={colors.foreground} size={20} />
        </Pressable>
      ) : showSettings ? (
        <HeaderAction type={leadingAction} avatarId={avatarId} />
      ) : (
        <View style={{ width: 42 }} />
      )}
      {title ? <Text variant="small">{title}</Text> : <View />}
      {showSettings ? (
        <HeaderAction type={trailingAction} avatarId={avatarId} />
      ) : (
        <View style={{ width: 42 }} />
      )}
    </View>
  );
}

function HeaderAction({ avatarId, type }: { avatarId?: string; type: "add" | "avatar" }) {
  if (type === "avatar") {
    return (
      <Pressable
        onPress={() => {
          playFeedback("select");
          router.push("/profile/avatar");
        }}
        style={({ pressed }) => ({
          opacity: pressed ? 0.72 : 1,
          paddingTop: spacing.compact,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        })}
      >
        <AvatarImage id={avatarId} size={36} />
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={() => {
        playFeedback("add");
        router.push("/habits/create");
      }}
      style={({ pressed }) => ({
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
        opacity: pressed ? 0.72 : 1,
        transform: [{ scale: pressed ? 0.94 : 1 }],
      })}
    >
      <View
        style={{
          width: 20,
          height: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Plus color={colors.foreground} size={20} strokeWidth={1.9} />
      </View>
    </Pressable>
  );
}
