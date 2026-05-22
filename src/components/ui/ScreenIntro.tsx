import { View, type ViewProps } from "react-native";

import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";

type ScreenIntroProps = ViewProps & {
  align?: "center" | "left";
  subtitle?: string;
  title: string;
  variant?: "display" | "heading";
};

export function ScreenIntro({ align = "left", style, subtitle, title, variant = "heading", ...props }: ScreenIntroProps) {
  const textAlign = align === "center" ? "center" : "left";

  return (
    <View {...props} style={[{ gap: spacing.smallGap }, style]}>
      <Text variant={variant} style={{ textAlign }}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          variant="body"
          color="muted"
          style={{
            maxWidth: 320,
            alignSelf: align === "center" ? "center" : "auto",
            textAlign,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
