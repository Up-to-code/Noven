import { Image, Pressable, useWindowDimensions, type PressableProps } from "react-native";

import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { playFeedback } from "@/lib/feedback";

type AddHabitGlyphProps = Omit<PressableProps, "children"> & {
  label?: string;
};

const emptyHabitIllustration = require("@/assets/illustrations/empty-state-habits-cropped.png");

export function AddHabitGlyph({ label = "Add your first habit", onPress, ...props }: AddHabitGlyphProps) {
  const { width } = useWindowDimensions();
  const imageWidth = Math.min(Math.max(width * 0.24, 88), 118);
  const imageHeight = imageWidth * (949 / 1029);

  return (
    <Pressable
      {...props}
      hitSlop={12}
      onPress={(event) => {
        playFeedback("add");
        onPress?.(event);
      }}
      style={({ pressed }) => ({
        alignItems: "center",
        gap: spacing.smallGap,
        alignSelf: "center",
        opacity: pressed ? 0.76 : 1,
        paddingTop: 0,
        paddingBottom: spacing.smallGap,
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}
    >
      <Image
        source={emptyHabitIllustration}
        resizeMode="contain"
        style={{
          width: imageWidth,
          height: imageHeight,
        }}
      />
      <Text
        variant="small"
        style={{
          minHeight: 34,
          overflow: "hidden",
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: spacing.componentGap,
          paddingVertical: spacing.smallGap - spacing.compact,
          backgroundColor: colors.background,
          color: colors.foreground,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
