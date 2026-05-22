import { Pressable, useWindowDimensions, View } from "react-native";

import { AvatarImage } from "@/components/ui/AvatarImage";
import { Text } from "@/components/ui/Text";
import { avatarOptions } from "@/content/avatars";
import { spacing } from "@/design/spacing";
import { playFeedback } from "@/lib/feedback";

type AvatarPickerGridProps = {
  selectedAvatarId?: string;
  onSelect: (avatarId: string) => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function getGridMetrics(width: number, height: number) {
  const usableWidth = Math.max(260, width - spacing.screenHorizontal * 2);
  const isTinyPhone = width < 375 || height < 700;
  const isSmallPhone = width < 410;
  const isWide = width >= 700;
  const columns = isTinyPhone ? 2 : isWide ? 4 : 3;
  const gap = clamp(usableWidth * (isTinyPhone ? 0.045 : 0.038), 12, 20);
  const itemWidth = Math.floor((usableWidth - gap * (columns - 1)) / columns);
  const avatarSize = clamp(itemWidth * (isTinyPhone ? 0.72 : isSmallPhone ? 0.7 : 0.68), 62, 92);
  const rowGap = clamp(height * 0.026, 16, 26);

  return { avatarSize, columns, gap, itemWidth, rowGap };
}

export function AvatarPickerGrid({ onSelect, selectedAvatarId }: AvatarPickerGridProps) {
  const { width, height } = useWindowDimensions();
  const metrics = getGridMetrics(width, height);

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        columnGap: metrics.gap,
        rowGap: metrics.rowGap,
      }}
    >
      {avatarOptions.map((avatar) => {
        const selected = selectedAvatarId === avatar.id;

        return (
          <Pressable
            key={avatar.id}
            onPress={() => {
              playFeedback(avatar.id === "custom" ? "add" : "select");
              onSelect(avatar.id);
            }}
            style={({ pressed }) => ({
              width: metrics.itemWidth,
              minHeight: metrics.avatarSize + 28,
              alignItems: "center",
              justifyContent: "flex-start",
              gap: spacing.smallGap,
              opacity: pressed ? 0.72 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <AvatarImage id={avatar.id} selected={selected} size={metrics.avatarSize} />
            <Text
              variant="small"
              color={selected ? "default" : "muted"}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.78}
              style={{
                maxWidth: metrics.itemWidth,
                textAlign: "center",
                fontSize: clamp(metrics.itemWidth * 0.13, 12, 14),
                lineHeight: 18,
              }}
            >
              {avatar.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
