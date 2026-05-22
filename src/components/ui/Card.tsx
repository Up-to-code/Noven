import type { ComponentProps } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";

type CardProps = Omit<ComponentProps<typeof View>, "style"> & {
  style?: StyleProp<ViewStyle>;
  variant?: "plain" | "surface" | "outline";
};

export function Card({ style, variant = "outline", ...props }: CardProps) {
  const baseStyle: ViewStyle = {
    borderRadius: radius.card,
    borderCurve: "continuous",
    padding: spacing.componentGap,
  };

  const variants: Record<NonNullable<CardProps["variant"]>, ViewStyle> = {
    plain: {
      backgroundColor: "transparent",
      borderWidth: 0,
    },
    surface: {
      backgroundColor: colors.surface,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderWidth: 1,
    },
  };

  return <View {...props} style={[baseStyle, variants[variant], style]} />;
}
