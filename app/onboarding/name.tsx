import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { ActionPanel } from "@/components/ui/ActionPanel";
import { Illustration } from "@/components/ui/Illustration";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";
import { useOnboardingStore } from "@/store/onboardingStore";

const nameSchema = z.object({
  name: z.string().trim().min(1, "Enter your name"),
});

type NameForm = z.infer<typeof nameSchema>;

export default function NameInputScreen() {
  const setName = useOnboardingStore((state) => state.setName);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: "" },
  });

  useFocusEffect(
    useCallback(() => {
      reset({ name: "" });
    }, [reset]),
  );

  const onSubmit = handleSubmit((values) => {
    setName(values.name);
    router.push("/onboarding/mbti");
  });

  return (
    <Screen
      scroll={false}
      contentStyle={{
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <ScreenHeader showBack />

      <View style={{ gap: spacing.smallGap }}>
        <Text variant="heading">Let's start with your name.</Text>
        <Text
          variant="body"
          color="muted"
          style={{
            fontSize: 16,
            lineHeight: 23,
          }}
        >
          What should we call you?
        </Text>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onBlur, onChange, value } }) => (
              <Input
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Your name"
                autoCapitalize="words"
                autoCorrect={false}
                error={errors.name?.message}
                style={{ marginTop: spacing.smallGap }}
              />
            )}
          />
        </KeyboardAvoidingView>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Illustration
          asset="name_writing_clean"
          contentFit="contain"
          mode="full"
          opacity={1}
          style={{
            width: "100%",
            maxWidth: 330,
            height: 292,
          }}
        />
      </View>

      <ActionPanel>
        <Button label="Continue" onPress={onSubmit} />
      </ActionPanel>
    </Screen>
  );
}
