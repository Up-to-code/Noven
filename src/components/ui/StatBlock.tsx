import { View, type StyleProp, type ViewStyle } from "react-native";

import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";

type StatBlockProps = {
  delay?: number;
  label: string;
  style?: StyleProp<ViewStyle>;
  value: string;
};

export function StatBlock({ delay = 0, label, style, value }: StatBlockProps) {
  void delay;

  return (
    <View
      style={[
        {
          flex: 1,
          borderRadius: radius.input,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.background,
          padding: spacing.componentGap,
        },
        style,
      ]}
    >
      <Text variant="caption" color="muted">
        {label}
      </Text>
      <Text variant="heading" style={{ marginTop: spacing.smallGap }}>
        {value}
      </Text>
    </View>
  );
}
