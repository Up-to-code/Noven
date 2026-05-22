import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { colors } from "@/design/colors";
import { radius } from "@/design/radius";

type GroupedListProps = ViewProps & {
  children: ReactNode;
};

export function GroupedList({ children, style, ...props }: GroupedListProps) {
  return (
    <View
      {...props}
      style={[
        {
          overflow: "hidden",
          borderRadius: radius.card,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
