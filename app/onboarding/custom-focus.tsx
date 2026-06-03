import { router } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ActionPanel } from "@/components/ui/ActionPanel";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { namePrefix } from "@/content/personalization";
import { spacing } from "@/design/spacing";
import { useAppLocale } from "@/localization";
import { useOnboardingStore } from "@/store/onboardingStore";

type CustomFocusForm = { focus: string };

export default function CustomFocusScreen() {
  const { t } = useAppLocale();
  const name = useOnboardingStore((state) => state.name);
  const setFocus = useOnboardingStore((state) => state.setFocus);
  const customFocusSchema = z.object({
    focus: z.string().trim().min(2, t("onboarding.customFocusRequired")),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomFocusForm>({
    resolver: zodResolver(customFocusSchema),
    defaultValues: { focus: "" },
  });

  useFocusEffect(
    useCallback(() => {
      reset({ focus: "" });
    }, [reset]),
  );

  const onSubmit = handleSubmit((values) => {
    setFocus(values.focus.trim());
    router.push("/onboarding/about");
  });

  return (
    <Screen
      scroll={false}
      topPadding={spacing.smallGap}
      contentStyle={{
        gap: spacing.componentGap,
      }}
    >
      <ScreenHeader showBack />

      <View style={{ gap: spacing.smallGap }}>
        <Text variant="heading" style={{ maxWidth: 320 }}>
          {t("onboarding.customFocusTitle", { prefix: namePrefix(name) })}
        </Text>
        <Text variant="body" color="muted" style={{ maxWidth: 300 }}>
          {t("onboarding.customFocusSubtitle")}
        </Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Controller
          control={control}
          name="focus"
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder={t("onboarding.customFocusPlaceholder")}
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.focus?.message}
            />
          )}
        />
      </KeyboardAvoidingView>

      <ActionPanel style={{ marginTop: "auto" }}>
        <Button label={t("common.continue")} onPress={onSubmit} />
      </ActionPanel>
    </Screen>
  );
}
