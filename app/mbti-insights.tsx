import { useMemo, useState } from "react";
import { Share, View } from "react-native";
import { Copy, Crown } from "lucide-react-native";
import { router } from "expo-router";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenIntro } from "@/components/ui/ScreenIntro";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";
import { colors } from "@/design/colors";
import { formatDate as formatLocalizedDate, localizeStoredFocus, translate as translateMarkdown, useAppLocale } from "@/localization";
import { useHabitStore } from "@/store/habitStore";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useReflectionStore } from "@/store/reflectionStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import type { Habit, HabitLog, Reflection } from "@/types";

type RangeKey = "7d" | "30d" | "90d" | "all";

type PromptInput = {
  focus?: string;
  habits: Habit[];
  habitLogs: HabitLog[];
  mbti?: string;
  name?: string;
  range: RangeKey;
  reflections: Reflection[];
};

const ranges: Array<{ key: RangeKey; label: string }> = [
  { key: "7d", label: "prompt.last7" },
  { key: "30d", label: "prompt.last30" },
  { key: "90d", label: "prompt.last90" },
  { key: "all", label: "prompt.all" },
];

export default function MbtiInsightsScreen() {
  const { t } = useAppLocale();
  const [range, setRange] = useState<RangeKey>("30d");
  const name = useOnboardingStore((state) => state.name);
  const mbti = useOnboardingStore((state) => state.selectedMbti);
  const focus = useOnboardingStore((state) => state.selectedFocus);
  const habits = useHabitStore((state) => state.habits);
  const habitLogs = useHabitStore((state) => state.habitLogs);
  const reflections = useReflectionStore((state) => state.reflections);
  const isPremium = useSubscriptionStore((state) => state.isPremium);

  const filteredReflections = useMemo(
    () => filterReflectionsByRange(reflections, range),
    [reflections, range],
  );

  const markdown = useMemo(
    () =>
      createMarkdownExtract({
        focus,
        habitLogs,
        habits,
        mbti,
        name,
        range,
        reflections: filteredReflections,
      }),
    [filteredReflections, focus, habitLogs, habits, mbti, name, range],
  );

  const subtitle = useMemo(() => {
    const count = filteredReflections.length;
    const rangeText = t(ranges.find((item) => item.key === range)?.label || "prompt.all").toLowerCase();
    return t("prompt.subtitle", { count, range: rangeText });
  }, [filteredReflections.length, range, t]);

  const sharePrompt = async () => {
    await Share.share({ message: markdown });
  };

  return (
    <Screen contentStyle={{ gap: spacing.sectionGap }}>
      <ScreenHeader title={t("prompt.title")} showBack />
      <ScreenIntro title={t("prompt.heading")} subtitle={subtitle} variant="heading" />

      {!isPremium ? <PremiumPromptGate /> : null}

      <View style={{ gap: spacing.componentGap, opacity: isPremium ? 1 : 0.35 }}>
        <View style={{ gap: spacing.smallGap }}>
          <Text variant="caption">{t("prompt.range")}</Text>
          <Chip.Group>
            {ranges.map((item) => (
              <Chip
                key={item.key}
                label={t(item.label)}
                onPress={() => setRange(item.key)}
                selected={range === item.key}
              />
            ))}
          </Chip.Group>
        </View>

        <MarkdownText markdown={markdown} />
      </View>

      <Button
        icon={isPremium ? Copy : Crown}
        label={isPremium ? t("prompt.share") : t("prompt.unlock")}
        onPress={
          isPremium
            ? sharePrompt
            : () =>
                router.push({
                  pathname: "/paywall",
                  params: {
                    placement: "settings",
                    returnTo: "/mbti-insights",
                  },
                })
        }
      />
    </Screen>
  );
}

function PremiumPromptGate() {
  const { t } = useAppLocale();

  return (
    <Card variant="surface" style={{ gap: spacing.smallGap }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.smallGap }}>
        <Crown color={colors.foreground} size={18} strokeWidth={1.7} />
        <Text variant="small" style={{ flex: 1 }}>
          {t("prompt.premiumTitle")}
        </Text>
      </View>
      <Text variant="small" color="muted">
        {t("prompt.premiumBody")}
      </Text>
    </Card>
  );
}

function filterReflectionsByRange(reflections: Reflection[], range: RangeKey) {
  if (range === "all") {
    return reflections;
  }

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return reflections.filter((reflection) => new Date(reflection.createdAt).getTime() >= cutoff);
}

function createMarkdownExtract(input: PromptInput) {
  const userName = input.name?.trim() || "me";
  const type = input.mbti && input.mbti !== "Unknown" ? input.mbti : "unknown";
  const focus = localizeStoredFocus(input.focus) || "not selected";
  const reflectionsByHabit = new Map<string, Reflection[]>();

  input.reflections.forEach((reflection) => {
    const key = reflection.habitId || "general";
    reflectionsByHabit.set(key, [...(reflectionsByHabit.get(key) || []), reflection]);
  });

  const habitLines = input.habits.length
    ? input.habits
        .map((habit) => {
          const habitReflections = reflectionsByHabit.get(habit.id) || [];
          const habitLogCount = input.habitLogs.filter((log) => log.habitId === habit.id).length;
          const noteLines = habitReflections
            .map((reflection) => {
              const date = formatDate(reflection.createdAt);
              const signals = reflection.options.join(", ") || "no selected signals";
              const notes = reflection.notes ? ` Notes: ${reflection.notes}` : "";
              return `  - ${date}: ${signals}.${notes}`;
            })
            .join("\n");

          return [
            `- ${habit.title}`,
            `  - Category: ${habit.category}`,
            `  - Frequency: ${habit.frequency}`,
            `  - Progress: ${Math.round(habit.progress * 100)}%`,
            `  - Completion logs: ${habitLogCount}`,
            habit.description ? `  - Description: ${habit.description}` : "",
            noteLines || "  - Notes in this range: none",
          ]
            .filter(Boolean)
            .join("\n");
        })
        .join("\n")
    : "- No habits yet";

  const generalReflections = reflectionsByHabit.get("general") || [];
  const generalLines = generalReflections.length
    ? generalReflections
        .map((reflection) => {
          const signals = reflection.options.join(", ") || "no selected signals";
          return `- ${formatDate(reflection.createdAt)}: ${signals}${reflection.notes ? `; notes: ${reflection.notes}` : ""}`;
        })
        .join("\n")
    : "- None";

  return [
    `# ${translateMarkdown("prompt.markdownTitle")}`,
    "",
    "Act as a calm habit and personality coach. Use only the data below. Do not invent medical or psychological certainty.",
    "",
    "## Profile",
    `- Name: ${userName}`,
    `- MBTI: ${type}`,
    `- Current focus: ${focus}`,
    `- Extract range: ${rangeLabel(input.range)}`,
    "",
    "## Habits and Notes",
    habitLines,
    "",
    "## General Reflections",
    generalLines,
    "",
    "## What I want from you",
    "- Explain the strongest pattern you see.",
    "- Identify what may be causing friction.",
    "- Suggest one adjustment to my routine.",
    "- Give me one small action for today.",
    "- Keep the answer concise and practical.",
  ].join("\n");
}

function MarkdownText({ markdown }: { markdown: string }) {
  return (
    <View style={{ gap: spacing.smallGap }}>
      {markdown.split("\n").map((line, index) => {
        if (!line.trim()) {
          return <View key={index} style={{ height: spacing.smallGap }} />;
        }

        if (line.startsWith("# ")) {
          return (
            <Text key={index} variant="heading">
              {line.replace("# ", "")}
            </Text>
          );
        }

        if (line.startsWith("## ")) {
          return (
            <Text key={index} variant="caption" style={{ marginTop: spacing.componentGap }}>
              {line.replace("## ", "")}
            </Text>
          );
        }

        return (
          <Text key={index} color={line.startsWith("-") || line.startsWith("  -") ? "default" : "muted"} variant="small">
            {line}
          </Text>
        );
      })}
    </View>
  );
}

function rangeLabel(range: RangeKey) {
  if (range === "7d") return "Last 7 days";
  if (range === "30d") return "Last 30 days";
  if (range === "90d") return "Last 90 days";
  return "All time";
}

function formatDate(value: string) {
  return formatLocalizedDate(value, {
    day: "numeric",
    month: "short",
  });
}
