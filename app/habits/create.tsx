import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Animated, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { useCanCreateHabit } from "@/hooks/useHabitCreationGate";
import { formatTime, useAppLocale } from "@/localization";
import { useHabitStore } from "@/store/habitStore";
import type { HabitCategory } from "@/types";

type HabitForm = { title: string };

const categories: HabitCategory[] = ["Focus", "Mind", "Energy", "Routine"];
const steps = ["habits.steps.name", "habits.steps.type", "habits.steps.time", "habits.steps.repeat"];

export default function CreateHabitScreen() {
  const { t } = useAppLocale();
  const addHabit = useHabitStore((state) => state.addHabit);
  const canCreateHabit = useCanCreateHabit();
  const habitSchema = z.object({
    title: z.string().trim().min(1, t("habits.nameRequired")),
  });
  const isSavingRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [reminderDate, setReminderDate] = useState(() => {
    const date = new Date();
    date.setHours(9, 0, 0, 0);
    return date;
  });
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [gapHours, setGapHours] = useState(4);
  const [category, setCategory] = useState<HabitCategory>("Routine");
  const [step, setStep] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<HabitForm>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: "",
    },
  });
  const title = useWatch({ control, name: "title" }) || "";

  useEffect(() => {
    if (!canCreateHabit) {
      router.replace({
        pathname: "/paywall",
        params: {
          placement: "settings",
          returnTo: "/(tabs)/habits",
        },
      });
    }
  }, [canCreateHabit]);

  useEffect(() => {
    fade.setValue(0);
    slide.setValue(10);
    Animated.parallel([
      Animated.timing(fade, {
        duration: 180,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        duration: 180,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, slide, step]);

  const onSubmit = handleSubmit((values) => {
    if (!canCreateHabit) {
      router.replace({
        pathname: "/paywall",
        params: {
          placement: "settings",
          returnTo: "/(tabs)/habits",
        },
      });
      return;
    }

    if (isSavingRef.current) {
      return;
    }

    isSavingRef.current = true;
    setIsSaving(true);
    const reminderTime = formatTime(reminderDate);
    const now = new Date().toISOString();
    addHabit({
      id: `${values.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      title: values.title,
      description: t("habits.frequency", { count: timesPerDay, hours: gapHours }),
      category,
      frequency: t("habits.dailyFrequency", { count: timesPerDay }),
      reminderTime,
      progress: 0,
      createdAt: now,
      updatedAt: now,
    });
    router.replace("/habits/setup-complete");
  });

  const goNext = async () => {
    if (step === 0) {
      const valid = await trigger("title");
      if (!valid) {
        return;
      }
    }

    setStep((current) => Math.min(steps.length - 1, current + 1));
  };

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ justifyContent: "space-between", gap: spacing.componentGap }}>
      <Screen.Section style={{ gap: spacing.sectionGap }}>
        <ScreenHeader title={t("habits.createTitle")} showBack />
        <StepBar step={step} />
        <Animated.View
          style={{
            opacity: fade,
            transform: [{ translateY: slide }],
          }}
        >
          {step === 0 ? (
            <JourneyCard eyebrow={t("habits.stepLabel", { step: 1 })} title={t("habits.nameTitle")} subtitle={t("habits.nameSubtitle")}>
              <Controller
                control={control}
                name="title"
                render={({ field: { onBlur, onChange, value } }) => (
                  <Input
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder={t("habits.namePlaceholder")}
                    error={errors.title?.message}
                    style={{ marginTop: spacing.componentGap }}
                  />
                )}
              />
            </JourneyCard>
          ) : null}
          {step === 1 ? (
            <JourneyCard eyebrow={t("habits.stepLabel", { step: 2 })} title={t("habits.shapeTitle")} subtitle={title ? t("habits.shapeNamedSubtitle", { title }) : t("habits.shapeSubtitle")}>
              <Chip.Group style={{ marginTop: spacing.componentGap }}>
                {categories.map((item) => (
                  <Chip key={item} label={t(`categories.${item}`)} selected={category === item} onPress={() => setCategory(item)} />
                ))}
              </Chip.Group>
            </JourneyCard>
          ) : null}
          {step === 2 ? (
            <JourneyCard eyebrow={t("habits.stepLabel", { step: 3 })} title={t("habits.reminderTitle")} subtitle={t("habits.reminderSubtitle")}>
              <DateTimePicker
                value={reminderDate}
                mode="time"
                display="spinner"
                onChange={(_, date) => {
                  if (date) setReminderDate(date);
                }}
                style={{ alignSelf: "stretch", marginTop: spacing.smallGap }}
                textColor={colors.foreground}
              />
            </JourneyCard>
          ) : null}
          {step === 3 ? (
            <JourneyCard eyebrow={t("habits.stepLabel", { step: 4 })} title={t("habits.rhythmTitle")} subtitle={t("habits.rhythmSubtitle")}>
              <CounterRow label={t("habits.timesPerDay")} value={timesPerDay} min={1} max={6} onChange={setTimesPerDay} />
              <CounterRow label={t("habits.gapBetween")} suffix="h" value={gapHours} min={1} max={12} onChange={setGapHours} />
            </JourneyCard>
          ) : null}
        </Animated.View>
      </Screen.Section>

      <View style={{ flexDirection: "row", gap: spacing.smallGap }}>
        {step > 0 ? (
          <Button
            label={t("common.back")}
            feedback="next"
            onPress={() => setStep((current) => Math.max(0, current - 1))}
            variant="secondary"
            style={{ flex: 1 }}
          />
        ) : null}
        <Button
          label={step === steps.length - 1 ? t("habits.saveHabit") : t("common.continue")}
          feedback={step === steps.length - 1 ? "success" : "next"}
          loading={isSaving}
          disabled={isSaving}
          onPress={step === steps.length - 1 ? onSubmit : goNext}
          style={{ flex: 1 }}
        />
      </View>
    </Screen>
  );
}

function StepBar({ step }: { step: number }) {
  const { t } = useAppLocale();

  return (
    <View style={{ gap: spacing.smallGap }}>
      <View style={{ flexDirection: "row", gap: spacing.smallGap }}>
        {steps.map((item, index) => (
          <View key={item} style={{ flex: 1, gap: spacing.smallGap }}>
            <View
              style={{
                height: 3,
                borderRadius: radius.pill,
                backgroundColor: index <= step ? colors.foreground : colors.border,
              }}
            />
            <Text
              variant="caption"
              color={index <= step ? "default" : "soft"}
              style={{
                fontSize: 10,
                letterSpacing: 1,
              }}
              numberOfLines={1}
            >
              {t(item)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function JourneyCard({
  children,
  eyebrow,
  subtitle,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  subtitle: string;
  title: string;
}) {
  return (
    <Card variant="plain" style={{ gap: spacing.smallGap, paddingHorizontal: 0 }}>
      <Text variant="caption">{eyebrow}</Text>
      <Text variant="heading">{title}</Text>
      <Text color="muted" variant="small">
        {subtitle}
      </Text>
      {children}
    </Card>
  );
}

function CounterRow({
  label,
  max,
  min,
  onChange,
  suffix = "",
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  suffix?: string;
  value: number;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: spacing.componentGap,
      }}
    >
      <Text variant="body">{label}</Text>
      <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.smallGap }}>
        <Button
          label="-"
          variant="secondary"
          pressLockMs={0}
          style={{ minHeight: 36, width: 44, paddingHorizontal: 0 }}
          onPress={() => onChange(Math.max(min, value - 1))}
        />
        <Text variant="body" style={{ minWidth: 42, textAlign: "center" }}>
          {value}{suffix}
        </Text>
        <Button
          label="+"
          variant="secondary"
          pressLockMs={0}
          style={{ minHeight: 36, width: 44, paddingHorizontal: 0 }}
          onPress={() => onChange(Math.min(max, value + 1))}
        />
      </View>
    </View>
  );
}
