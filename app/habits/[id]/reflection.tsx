import { router, useLocalSearchParams } from "expo-router";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenIntro } from "@/components/ui/ScreenIntro";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";
import { useAppLocale } from "@/localization";
import { useReflectionStore } from "@/store/reflectionStore";
import type { ReflectionOption } from "@/types";

const options: ReflectionOption[] = [
  "Felt focused",
  "Had enough time",
  "Felt stressed",
  "Was distracted",
  "Forgot",
  "Not in the mood",
];

const optionLabels: Record<ReflectionOption, string> = {
  "Felt focused": "reflection.options.feltFocused",
  "Had enough time": "reflection.options.hadEnoughTime",
  "Felt stressed": "reflection.options.feltStressed",
  "Was distracted": "reflection.options.wasDistracted",
  Forgot: "reflection.options.forgot",
  "Not in the mood": "reflection.options.notInMood",
};

export default function DailyReflectionScreen() {
  const { t } = useAppLocale();
  const { id } = useLocalSearchParams<{ id: string }>();
  const draftNotes = useReflectionStore((state) => state.draftNotes);
  const draftOptions = useReflectionStore((state) => state.draftOptions);
  const setDraftNotes = useReflectionStore((state) => state.setDraftNotes);
  const toggleOption = useReflectionStore((state) => state.toggleOption);
  const addReflection = useReflectionStore((state) => state.addReflection);

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ justifyContent: "space-between", gap: spacing.componentGap }}>
      <Screen.Section>
        <ScreenHeader title={t("reflection.title")} showBack />
        <ScreenIntro title={t("reflection.heading")} subtitle={t("reflection.subtitle")} variant="heading" />
        <Chip.Group style={{ marginTop: spacing.componentGap }}>
          {options.map((option) => (
            <Chip
              key={option}
              label={t(optionLabels[option])}
              selected={draftOptions.includes(option)}
              onPress={() => toggleOption(option)}
            />
          ))}
        </Chip.Group>
        <Input
          multiline
          value={draftNotes}
          onChangeText={setDraftNotes}
          placeholder={t("reflection.placeholder")}
          style={{ marginTop: spacing.componentGap }}
        />
      </Screen.Section>

      <Button
        label={t("reflection.save")}
        onPress={() => {
          addReflection({
            habitId: id,
            userId: "local-user",
            options: draftOptions,
            notes: draftNotes,
          });
          router.push(`/habits/${id}/milestone`);
        }}
      />
    </Screen>
  );
}
