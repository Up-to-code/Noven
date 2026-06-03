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
import { useAppLocale } from "@/localization";
import { useOnboardingStore } from "@/store/onboardingStore";

type NameForm = { name: string };

export default function SettingsNameScreen() {
  const { t } = useAppLocale();
  const currentName = useOnboardingStore((state) => state.name);
  const setName = useOnboardingStore((state) => state.setName);
  const schema = z.object({
    name: z.string().trim().min(1, t("onboarding.nameRequired")),
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NameForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: currentName },
  });

  const onSubmit = handleSubmit((values) => {
    setName(values.name.trim());
    router.replace("/settings");
  });

  return (
    <Screen scroll={false} topPadding={spacing.smallGap} contentStyle={{ justifyContent: "space-between" }}>
      <View style={{ gap: spacing.componentGap }}>
        <ScreenHeader title={t("settings.name")} showBack />
        <View style={{ gap: spacing.smallGap }}>
          <Text variant="heading">{t("settings.editNameTitle")}</Text>
          <Text variant="body" color="muted">
            {t("settings.editNameSubtitle")}
          </Text>
        </View>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                autoCapitalize="words"
                autoCorrect={false}
                error={errors.name?.message}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder={t("onboarding.namePlaceholder")}
                returnKeyType="done"
                value={value}
                onSubmitEditing={onSubmit}
              />
            )}
          />
        </KeyboardAvoidingView>
      </View>

      <Button disabled={isSubmitting} label={t("settings.saveName")} loading={isSubmitting} onPress={onSubmit} />
    </Screen>
  );
}
