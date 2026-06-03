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
import { localizeStoredFocus, useAppLocale } from "@/localization";
import { useOnboardingStore } from "@/store/onboardingStore";

type FocusForm = { focus: string };

export default function SettingsFocusScreen() {
  const { t } = useAppLocale();
  const currentFocus = useOnboardingStore((state) => state.selectedFocus);
  const setFocus = useOnboardingStore((state) => state.setFocus);
  const schema = z.object({
    focus: z.string().trim().min(2, t("onboarding.customFocusRequired")),
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FocusForm>({
    resolver: zodResolver(schema),
    defaultValues: { focus: currentFocus ? localizeStoredFocus(currentFocus, t) : "" },
  });

  const onSubmit = handleSubmit((values) => {
    setFocus(values.focus.trim());
    router.replace("/settings");
  });

  return (
    <Screen scroll={false} topPadding={spacing.smallGap} contentStyle={{ justifyContent: "space-between" }}>
      <View style={{ gap: spacing.componentGap }}>
        <ScreenHeader title={t("settings.focus")} showBack />
        <View style={{ gap: spacing.smallGap }}>
          <Text variant="heading">{t("settings.editFocusTitle")}</Text>
          <Text variant="body" color="muted">
            {t("settings.editFocusSubtitle")}
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
                placeholder={t("onboarding.customFocusPlaceholder")}
                returnKeyType="done"
                value={value}
                onSubmitEditing={onSubmit}
              />
            )}
          />
        </KeyboardAvoidingView>
      </View>

      <Button disabled={isSubmitting} label={t("settings.saveFocus")} loading={isSubmitting} onPress={onSubmit} />
    </Screen>
  );
}
