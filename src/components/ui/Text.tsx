import type { ComponentProps } from "react";
import { Text as RNText, type TextStyle } from "react-native";

import { colors } from "@/design/colors";
import { typography } from "@/design/typography";

type NTextVariant = keyof typeof typography;
type NTextColor = "default" | "muted" | "soft" | "inverse" | "danger" | "success" | "warning";

type TextProps = Omit<ComponentProps<typeof RNText>, "children"> & {
  children?: React.ReactNode;
  color?: NTextColor;
  variant?: NTextVariant;
};

const colorMap: Record<NTextColor, string> = {
  default: colors.foreground,
  muted: colors.mutedText,
  soft: colors.softText,
  inverse: colors.background,
  danger: colors.danger,
  success: colors.success,
  warning: colors.warning,
};

export function Text({ children, color = "default", style, variant = "body", ...props }: TextProps) {
  return (
    <RNText
      {...props}
      selectable={props.selectable ?? true}
      style={[
        typography[variant] as TextStyle,
        {
          color: colorMap[color],
          includeFontPadding: false,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
