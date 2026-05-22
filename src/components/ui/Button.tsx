import type { ComponentType, ReactNode } from "react";
import { useRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  View,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type { LucideProps } from "lucide-react-native";

import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { playFeedback, type FeedbackTone } from "@/lib/feedback";

type ButtonTone = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  icon?: ComponentType<LucideProps> | ReactNode;
  feedback?: FeedbackTone;
  label: string;
  loading?: boolean;
  pressLockMs?: number;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: ButtonTone;
};

function renderIcon(icon: ButtonProps["icon"], color: string) {
  if (!icon) {
    return null;
  }

  if (typeof icon === "function" || (typeof icon === "object" && "render" in icon)) {
    const Icon = icon as ComponentType<LucideProps>;
    return <Icon color={color} size={20} strokeWidth={1.8} />;
  }

  return icon;
}

export function Button({
  disabled,
  feedback = "select",
  icon,
  label,
  loading = false,
  onPress,
  pressLockMs = 650,
  right,
  style,
  variant = "primary",
  ...props
}: ButtonProps) {
  const lastPressAt = useRef(0);
  const isPrimary = variant === "primary" || variant === "danger";
  const iconColor = isPrimary ? colors.background : colors.foreground;
  const textColor = isPrimary ? "inverse" : "default";
  const inactive = disabled || loading;

  const handlePress = (event: GestureResponderEvent) => {
    const now = Date.now();
    if (!inactive) {
      if (pressLockMs > 0 && now - lastPressAt.current < pressLockMs) {
        return;
      }

      playFeedback(feedback);
      lastPressAt.current = now;
      onPress?.(event);
    }
  };

  return (
    <Pressable
      {...props}
      disabled={inactive}
      onPress={handlePress}
      style={({ pressed }) => [
        {
          minHeight: spacing.touch,
          borderRadius: radius.button,
          borderCurve: "continuous",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: spacing.smallGap,
          backgroundColor:
            variant === "primary"
              ? colors.foreground
              : variant === "danger"
                ? colors.danger
                : variant === "secondary"
                  ? colors.background
                  : "transparent",
          borderWidth: variant === "secondary" ? 1 : 0,
          borderColor: colors.border,
          opacity: inactive ? 0.48 : pressed ? 0.84 : 1,
          paddingHorizontal: spacing.componentGap,
          position: "relative",
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: spacing.smallGap,
            justifyContent: "center",
          }}
        >
          {icon ? <View>{renderIcon(icon, iconColor)}</View> : null}
          <Text color={textColor} variant="body" style={{ textAlign: "center" }}>
            {label}
          </Text>
        </View>
      )}
      {right ? <View style={{ position: "absolute", right: spacing.componentGap }}>{right}</View> : null}
    </Pressable>
  );
}
