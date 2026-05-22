import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { View } from "react-native";
import { Flame } from "lucide-react-native";

import { ActionPanel } from "@/components/ui/ActionPanel";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { useResponsiveMetrics } from "@/hooks/useResponsiveMetrics";
import { currentStreak } from "@/lib/habitAnalytics";
import { firstName } from "@/content/personalization";
import { useHabitStore } from "@/store/habitStore";
import { useOnboardingStore } from "@/store/onboardingStore";

const milestoneIllustration = require("@/assets/illustrations/name-writing-desk.png");

export default function MilestoneScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const metrics = useResponsiveMetrics({ horizontalPadding: spacing.screenHorizontal });
  const name = useOnboardingStore((state) => state.name);
  const habitLogs = useHabitStore((state) => state.habitLogs);
  const streak = currentStreak(habitLogs, id);
  const displayName = firstName(name);
  const illustrationHeight = metrics.scaleHeight(0.36, metrics.isCompact ? 250 : 290, metrics.isRoomy ? 380 : 340);
  const illustrationWidth = metrics.scaleWidth(0.86, 292, 390);

  return (
    <Screen
      topPadding={spacing.sectionGap}
      contentStyle={{
        gap: spacing.componentGap,
        justifyContent: "space-between",
      }}
    >
      <View style={{ alignItems: "center", gap: spacing.componentGap }}>
        <Image
          contentFit="contain"
          source={milestoneIllustration}
          style={{
            height: illustrationHeight,
            width: illustrationWidth,
          }}
        />

        <View style={{ alignItems: "center", gap: spacing.smallGap }}>
          <Text
            variant="display"
            style={{
              fontSize: metrics.scaleWidth(0.115, 38, 52),
              lineHeight: metrics.scaleWidth(0.135, 46, 62),
              textAlign: "center",
            }}
          >
            Great job{displayName ? `, ${displayName}` : ""}.
          </Text>
          <Text
            color="muted"
            variant="body"
            style={{
              fontSize: metrics.isCompact ? 16 : 18,
              lineHeight: metrics.isCompact ? 24 : 28,
              textAlign: "center",
            }}
          >
            You've built momentum. Keep going.
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            minHeight: metrics.scaleHeight(0.13, 104, 128),
            borderRadius: 22,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.background,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: spacing.componentGap,
            paddingVertical: spacing.componentGap,
          }}
        >
          <View style={{ gap: spacing.componentGap }}>
            <Text color="muted" variant="caption">
              STREAK
            </Text>
            <Text
              variant="display"
              style={{
                fontSize: metrics.scaleWidth(0.098, 34, 46),
                lineHeight: metrics.scaleWidth(0.115, 40, 54),
              }}
            >
              {streak} day{streak === 1 ? "" : "s"}
            </Text>
          </View>
          <Flame color="#F28F98" size={metrics.scaleWidth(0.076, 28, 38)} strokeWidth={1.8} />
        </View>
      </View>

      <ActionPanel style={{ gap: 12 }}>
        <Button
          label="View Progress"
          onPress={() => router.replace("/(tabs)/patterns")}
          style={{
            minHeight: metrics.scaleHeight(0.064, 52, 58),
            borderRadius: 14,
          }}
        />
        <Button
          label="Continue"
          variant="secondary"
          onPress={() => router.replace(`/habits/${id}`)}
          style={{
            minHeight: metrics.scaleHeight(0.062, 50, 56),
            borderColor: colors.border,
            borderRadius: 14,
          }}
        />
      </ActionPanel>
    </Screen>
  );
}
