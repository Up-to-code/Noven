import { router, useLocalSearchParams } from "expo-router";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenIntro } from "@/components/ui/ScreenIntro";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";
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

export default function DailyReflectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const draftNotes = useReflectionStore((state) => state.draftNotes);
  const draftOptions = useReflectionStore((state) => state.draftOptions);
  const setDraftNotes = useReflectionStore((state) => state.setDraftNotes);
  const toggleOption = useReflectionStore((state) => state.toggleOption);
  const addReflection = useReflectionStore((state) => state.addReflection);

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ justifyContent: "space-between", gap: spacing.componentGap }}>
      <Screen.Section>
        <ScreenHeader title="Reflection" showBack />
        <ScreenIntro title="How did it go?" subtitle="Pick what shaped the habit today." variant="heading" />
        <Chip.Group style={{ marginTop: spacing.componentGap }}>
          {options.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={draftOptions.includes(option)}
              onPress={() => toggleOption(option)}
            />
          ))}
        </Chip.Group>
        <Input
          multiline
          value={draftNotes}
          onChangeText={setDraftNotes}
          placeholder="Write an optional reflection..."
          style={{ marginTop: spacing.componentGap }}
        />
      </Screen.Section>

      <Button
        label="Save Reflection"
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
