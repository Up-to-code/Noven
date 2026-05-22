import { router } from "expo-router";
import { Image } from "expo-image";
import { View } from "react-native";

import { ActionPanel } from "@/components/ui/ActionPanel";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { spacing } from "@/design/spacing";
import { useResponsiveMetrics } from "@/hooks/useResponsiveMetrics";

const completeIllustration = require("@/assets/illustrations/habit-complete-lounge.png");

export default function SetupCompleteScreen() {
  const metrics = useResponsiveMetrics({ horizontalPadding: spacing.screenHorizontal });
  const illustrationHeight = metrics.scaleHeight(0.46, metrics.isCompact ? 330 : 360, metrics.isRoomy ? 470 : 430);
  const illustrationWidth = Math.min(metrics.width + (metrics.isCompact ? 12 : 28), 430);

  return (
    <Screen
      topPadding={spacing.sectionGap}
      contentStyle={{
        gap: spacing.componentGap,
        justifyContent: "space-between",
      }}
    >
      <View style={{ gap: spacing.sectionGap }}>
        <View style={{ gap: 16 }}>
          <Text
            variant="display"
            style={{
              fontSize: metrics.isCompact ? 34 : 38,
              lineHeight: metrics.isCompact ? 40 : 46,
              maxWidth: 310,
            }}
          >
            You're all set.
          </Text>
          <Text
            color="muted"
            variant="body"
            style={{
              fontSize: metrics.isCompact ? 16 : 18,
              lineHeight: metrics.isCompact ? 25 : 28,
              maxWidth: 305,
            }}
          >
            Your habit has been added to your system.
          </Text>
        </View>
        <Text
          color="muted"
          variant="body"
          style={{
            fontSize: metrics.isCompact ? 15 : 17,
            lineHeight: metrics.isCompact ? 24 : 27,
            maxWidth: 330,
          }}
        >
          Start with one quiet repetition today.
        </Text>
      </View>

      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          marginHorizontal: -spacing.screenHorizontal,
          minHeight: illustrationHeight,
          overflow: "hidden",
        }}
      >
        <Image
          contentFit="contain"
          source={completeIllustration}
          style={{
            height: illustrationHeight,
            width: illustrationWidth,
          }}
        />
      </View>

      <ActionPanel style={{ gap: 12 }}>
        <Button
          label="Start Today"
          feedback="success"
          onPress={() => router.replace("/(tabs)/habits")}
          style={{
            minHeight: metrics.isCompact ? 52 : 56,
            borderRadius: 14,
          }}
        />
        <Button
          label="Add Another Habit"
          variant="secondary"
          onPress={() => router.replace("/habits/create")}
          style={{
            minHeight: metrics.isCompact ? 50 : 54,
            borderColor: colors.border,
            borderRadius: 14,
          }}
        />
      </ActionPanel>
    </Screen>
  );
}
