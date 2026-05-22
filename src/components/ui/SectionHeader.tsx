import { View, type ViewProps } from "react-native";

import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";

type SectionHeaderProps = ViewProps & {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ style, subtitle, title, ...props }: SectionHeaderProps) {
  return (
    <View {...props} style={[{ gap: spacing.smallGap }, style]}>
      <Text variant="heading">{title}</Text>
      {subtitle ? (
        <Text variant="body" color="muted">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
