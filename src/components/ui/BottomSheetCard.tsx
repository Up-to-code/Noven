import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";

type BottomSheetCardProps = ViewProps & {
  children: ReactNode;
};

export function BottomSheetCard({ children, style, ...props }: BottomSheetCardProps) {
  return (
    <View
      {...props}
      style={[
        {
          borderRadius: radius.card,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
          padding: spacing.componentGap,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
