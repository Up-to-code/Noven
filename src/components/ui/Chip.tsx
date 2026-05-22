import type { ReactNode } from "react";
import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";

type ChipProps = Omit<PressableProps, "style"> & {
  label: string;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

function Group({ children, style, ...props }: ViewProps & { children: ReactNode }) {
  return (
    <View
      {...props}
      style={[
        {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: spacing.smallGap,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Chip({ label, selected = false, style, ...props }: ChipProps) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        {
          minHeight: 38,
          borderRadius: radius.pill,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          backgroundColor: selected ? colors.foreground : colors.background,
          borderColor: selected ? colors.foreground : colors.border,
          opacity: pressed ? 0.82 : 1,
          paddingHorizontal: spacing.smallGap + spacing.compact,
        },
        style,
      ]}
    >
      <Text variant="small" color={selected ? "inverse" : "default"}>
        {label}
      </Text>
    </Pressable>
  );
}

Chip.Group = Group;
