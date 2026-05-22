import type { ReactNode } from "react";
import { View, type ViewProps } from "react-native";

import { spacing } from "@/design/spacing";

type ActionPanelProps = ViewProps & {
  children: ReactNode;
};

export function ActionPanel({ children, style, ...props }: ActionPanelProps) {
  return (
    <View
      {...props}
      style={[
        {
          gap: spacing.smallGap,
          paddingTop: spacing.smallGap,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
