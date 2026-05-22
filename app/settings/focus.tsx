import { router } from "expo-router";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";
import { useOnboardingStore } from "@/store/onboardingStore";

const schema = z.object({
  focus: z.string().trim().min(2, "Add a focus to continue"),
});

type FocusForm = z.infer<typeof schema>;

export default function SettingsFocusScreen() {
  const currentFocus = useOnboardingStore((state) => state.selectedFocus);
  const setFocus = useOnboardingStore((state) => state.setFocus);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FocusForm>({
    resolver: zodResolver(schema),
    defaultValues: { focus: currentFocus || "" },
  });

  const onSubmit = handleSubmit((values) => {
    setFocus(values.focus.trim());
    router.replace("/settings");
  });

  return (
    <Screen scroll={false} topPadding={spacing.smallGap} contentStyle={{ justifyContent: "space-between" }}>
      <View style={{ gap: spacing.componentGap }}>
        <ScreenHeader title="Focus" showBack />
        <View style={{ gap: spacing.smallGap }}>
          <Text variant="heading">Edit focus.</Text>
          <Text variant="body" color="muted">
            Name the thing your system should support right now.
          </Text>
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Controller
            control={control}
            name="focus"
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                autoCapitalize="sentences"
                autoCorrect={false}
                error={errors.focus?.message}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Your focus"
                returnKeyType="done"
                value={value}
                onSubmitEditing={onSubmit}
              />
            )}
          />
        </KeyboardAvoidingView>
      </View>

      <Button disabled={isSubmitting} label="Save Focus" loading={isSubmitting} onPress={onSubmit} />
    </Screen>
  );
}
