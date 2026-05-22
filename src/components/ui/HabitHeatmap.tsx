import { View, type ViewProps } from "react-native";

import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";

type HabitHeatmapProps = ViewProps & {
  days?: number;
  levels?: number[];
};

function shade(index: number) {
  const pattern = [0, 1, 0, 2, 1, 3, 0, 1, 2, 0, 3, 1, 0, 2, 1];
  return pattern[index % pattern.length];
}

export function HabitHeatmap({ days = 90, levels, style, ...props }: HabitHeatmapProps) {
  const resolvedLevels = levels || Array.from({ length: days }, (_, index) => shade(index));

  return (
    <View
      {...props}
      style={[
        {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: spacing.compact,
        },
        style,
      ]}
    >
      {resolvedLevels.slice(-days).map((level, index) => {
        return (
          <View
            key={index}
            style={{
              width: 10,
              height: 10,
              borderRadius: radius.input / 4,
              backgroundColor:
                level === 0
                  ? colors.surface
                  : level === 1
                    ? "#DADADD"
                    : level === 2
                      ? "#9A9AA1"
                      : colors.foreground,
            }}
          />
        );
      })}
    </View>
  );
}
