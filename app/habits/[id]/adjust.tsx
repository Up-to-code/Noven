import { router, useLocalSearchParams } from "expo-router";
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
import { useHabitStore } from "@/store/habitStore";
import type { Habit, HabitCategory } from "@/types";

const habitSchema = z.object({
  title: z.string().trim().min(1, "Habit name is required"),
});

type HabitForm = z.infer<typeof habitSchema>;

const categories: HabitCategory[] = ["Focus", "Mind", "Energy", "Routine"];
const steps = ["Name", "Type", "Time", "Repeat"];

export default function AdjustHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const habit = useHabitStore((state) => state.getHabit(id));
  const updateHabit = useHabitStore((state) => state.updateHabit);
  const isSavingRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [reminderDate, setReminderDate] = useState(() => reminderTimeToDate(habit?.reminderTime));
  const [timesPerDay, setTimesPerDay] = useState(() => parseTimesPerDay(habit));
  const [gapHours, setGapHours] = useState(() => parseGapHours(habit));
  const [category, setCategory] = useState<HabitCategory>(habit?.category || "Routine");
  const [step, setStep] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm<HabitForm>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: habit?.title || "",
    },
  });
  const title = useWatch({ control, name: "title" }) || "";

  useEffect(() => {
    if (!habit) {
      return;
    }

    reset({ title: habit.title });
    setCategory(habit.category);
    setReminderDate(reminderTimeToDate(habit.reminderTime));
    setTimesPerDay(parseTimesPerDay(habit));
    setGapHours(parseGapHours(habit));
  }, [habit, reset]);

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

  if (!habit) {
    return (
      <Screen>
        <ScreenHeader showBack />
        <Text variant="heading">Habit not found</Text>
        <Text color="muted" variant="body">
          This habit may have been removed from your local system.
        </Text>
      </Screen>
    );
  }

  const onSubmit = handleSubmit((values) => {
    if (isSavingRef.current) {
      return;
    }

    isSavingRef.current = true;
    setIsSaving(true);
    const reminderTime = reminderDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    updateHabit({
      ...habit,
      title: values.title,
      description: `${timesPerDay} time${timesPerDay > 1 ? "s" : ""} daily, spaced by ${gapHours}h.`,
      category,
      frequency: `${timesPerDay}x daily`,
      reminderTime,
    });
    router.replace(`/habits/${habit.id}`);
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
        <ScreenHeader title="Edit" showBack />
        <StepBar step={step} />
        <Animated.View
          style={{
            opacity: fade,
            transform: [{ translateY: slide }],
          }}
        >
          {step === 0 ? (
            <JourneyCard eyebrow="STEP 1" title="Name the habit" subtitle="Update the name you want to see on this goal.">
              <Controller
                control={control}
                name="title"
                render={({ field: { onBlur, onChange, value } }) => (
                  <Input
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Habit name"
                    error={errors.title?.message}
                    style={{ marginTop: spacing.componentGap }}
                  />
                )}
              />
            </JourneyCard>
          ) : null}
          {step === 1 ? (
            <JourneyCard eyebrow="STEP 2" title="Choose its shape" subtitle={title ? `${title} belongs closest to...` : "Pick the closest habit family."}>
              <Chip.Group style={{ marginTop: spacing.componentGap }}>
                {categories.map((item) => (
                  <Chip key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />
                ))}
              </Chip.Group>
            </JourneyCard>
          ) : null}
          {step === 2 ? (
            <JourneyCard eyebrow="STEP 3" title="Set the reminder" subtitle="Move the nudge to the moment it fits best.">
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
            <JourneyCard eyebrow="STEP 4" title="Tune the rhythm" subtitle="Change the repetition count and spacing.">
              <CounterRow label="Times per day" value={timesPerDay} min={1} max={6} onChange={setTimesPerDay} />
              <CounterRow label="Gap between" suffix="h" value={gapHours} min={1} max={12} onChange={setGapHours} />
            </JourneyCard>
          ) : null}
        </Animated.View>
      </Screen.Section>

      <View style={{ flexDirection: "row", gap: spacing.smallGap }}>
        {step > 0 ? (
          <Button
            label="Back"
            feedback="next"
            onPress={() => setStep((current) => Math.max(0, current - 1))}
            variant="secondary"
            style={{ flex: 1 }}
          />
        ) : null}
        <Button
          label={step === steps.length - 1 ? "Save Changes" : "Continue"}
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
              {item}
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
          {value}
          {suffix}
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

function reminderTimeToDate(reminderTime?: string) {
  const date = new Date();
  const fallback = { hours: 9, minutes: 0 };
  const parsed = reminderTime?.match(/(\d{1,2}):(\d{2})/);
  const hours = parsed ? Number(parsed[1]) : fallback.hours;
  const minutes = parsed ? Number(parsed[2]) : fallback.minutes;

  date.setHours(hours, minutes, 0, 0);
  return date;
}

function parseTimesPerDay(habit?: Habit) {
  const parsed = habit?.frequency.match(/(\d+)x daily/) || habit?.description.match(/(\d+) time/);
  return clampNumber(parsed ? Number(parsed[1]) : 1, 1, 6);
}

function parseGapHours(habit?: Habit) {
  const parsed = habit?.description.match(/spaced by (\d+)h/);
  return clampNumber(parsed ? Number(parsed[1]) : 4, 1, 12);
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
