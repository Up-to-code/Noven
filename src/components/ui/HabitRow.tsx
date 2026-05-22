import { Pressable, View, type PressableProps } from "react-native";
import { ChevronRight } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useRef } from "react";

import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import type { Habit } from "@/types";

type HabitRowProps = Omit<PressableProps, "style"> & {
  habit: Habit;
  index?: number;
};

export function HabitRow({ habit, ...props }: HabitRowProps) {
  const lastPressAt = useRef(0);

  const handlePress = (event: any) => {
    const now = Date.now();
    if (now - lastPressAt.current < 650) {
      return;
    }

    lastPressAt.current = now;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    props.onPress?.(event);
  };

  return (
    <Pressable
      {...props}
      onPress={handlePress}
      style={({ pressed }) => ({
        borderRadius: radius.input,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.background,
        opacity: pressed ? 0.82 : 1,
        padding: spacing.componentGap,
        gap: spacing.componentGap,
      })}
    >
      <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text variant="body" style={{ letterSpacing: -0.2 }}>
            {habit.title}
          </Text>
          <Text variant="small" color="muted" style={{ marginTop: 2 }}>
            {habit.frequency}
          </Text>
        </View>
        <ChevronRight color={colors.softText} size={18} strokeWidth={1.5} />
      </View>
    </Pressable>
  );
}
