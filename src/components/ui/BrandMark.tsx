import { View, type ViewProps } from "react-native";

import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";

type BrandMarkProps = ViewProps & {
  compact?: boolean;
  showWordmark?: boolean;
};

export function BrandMark({ compact = false, showWordmark = true, style, ...props }: BrandMarkProps) {
  const size = compact ? 70 : 92;
  const ring = compact ? 62 : 82;

  return (
    <View {...props} style={[{ alignItems: "center", gap: spacing.compact }, style]}>
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: ring,
            height: ring,
            borderRadius: radius.pill,
            borderWidth: 1,
            borderColor: colors.foreground,
            opacity: 0.78,
          }}
        />
        <Text variant="display" style={{ fontSize: compact ? 44 : 56, lineHeight: compact ? 52 : 64 }}>
          N
        </Text>
        <Text
          variant="heading"
          style={{
            position: "absolute",
            top: compact ? 4 : 2,
            right: compact ? 4 : 2,
            fontSize: compact ? 18 : 22,
            lineHeight: compact ? 20 : 24,
          }}
        >
          *
        </Text>
      </View>
      {showWordmark ? (
        <Text
          variant="caption"
          style={{
            fontSize: compact ? 14 : 18,
            letterSpacing: compact ? 9 : 12,
            textAlign: "center",
          }}
        >
          NOVEN
        </Text>
      ) : null}
    </View>
  );
}
