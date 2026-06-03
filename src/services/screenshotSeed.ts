import type { AppLocale } from "@/localization";
import { getDatabase, savePreference } from "@/services/database";

const screenshotUserId = "local-user";
const seedKey = "screenshotSeedVersion";
const seedVersion = "2026-05-store-screenshots";

const habits = [
  {
    id: "seed-morning-focus",
    title: "Morning Focus",
    description: "2 times daily, spaced by 4h.",
    category: "Focus",
    frequency: "2x daily",
    reminderTime: "09:00",
    progress: 0.74,
  },
  {
    id: "seed-evening-reflection",
    title: "Evening Reflection",
    description: "1 time daily, spaced by 4h.",
    category: "Mind",
    frequency: "1x daily",
    reminderTime: "20:30",
    progress: 0.62,
  },
  {
    id: "seed-energy-reset",
    title: "Energy Reset",
    description: "1 time daily, spaced by 4h.",
    category: "Energy",
    frequency: "1x daily",
    reminderTime: "14:00",
    progress: 0.48,
  },
] as const;

export async function seedScreenshotData(locale?: AppLocale) {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<{ value: string }>("SELECT value FROM preferences WHERE key = ?", seedKey);

  if (existing?.value === seedVersion) {
    if (locale) {
      await savePreference("languageOverride", locale);
    }
    return;
  }

  const now = new Date();
  await db.execAsync(`
    DELETE FROM user_profile;
    DELETE FROM reflections;
    DELETE FROM habit_logs;
    DELETE FROM habits;
  `);

  await db.runAsync(
    `INSERT INTO user_profile (id, name, avatar_id, mbti, focus_goal, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    screenshotUserId,
    "Alx",
    "strategist",
    "INTJ",
    "Better focus",
    now.toISOString(),
    now.toISOString(),
  );

  for (const [index, habit] of habits.entries()) {
    const createdAt = shiftDate(now, -(18 + index * 3)).toISOString();
    await db.runAsync(
      `INSERT INTO habits (id, user_id, title, description, category, frequency, reminder_time, progress, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      habit.id,
      screenshotUserId,
      habit.title,
      habit.description,
      habit.category,
      habit.frequency,
      habit.reminderTime,
      habit.progress,
      createdAt,
      now.toISOString(),
    );
  }

  const logDays = [0, 1, 2, 3, 5, 6, 8, 9, 12, 14, 16];
  let logIndex = 0;
  for (const habit of habits) {
    for (const dayOffset of logDays.slice(0, habit.id === "seed-energy-reset" ? 7 : 10)) {
      const completedAt = shiftDate(now, -dayOffset);
      completedAt.setHours(habit.id === "seed-evening-reflection" ? 20 : 9, 15 + (logIndex % 2) * 30, 0, 0);
      await db.runAsync(
        `INSERT INTO habit_logs (id, habit_id, user_id, completed_at, reflection_id)
         VALUES (?, ?, ?, ?, ?)`,
        `seed-log-${logIndex}`,
        habit.id,
        screenshotUserId,
        completedAt.toISOString(),
        null,
      );
      logIndex += 1;
    }
  }

  const reflectionRows = [
    {
      habitId: "seed-morning-focus",
      notes: "Focus felt easier after starting before messages.",
      options: ["Felt focused", "Had enough time"],
    },
    {
      habitId: "seed-evening-reflection",
      notes: "The short reflection helped me notice one repeating distraction.",
      options: ["Felt focused"],
    },
    {
      habitId: null,
      notes: "The system works best when the first step stays small.",
      options: ["Had enough time"],
    },
  ];

  for (const [index, reflection] of reflectionRows.entries()) {
    await db.runAsync(
      `INSERT INTO reflections (id, habit_id, user_id, options_json, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      `seed-reflection-${index}`,
      reflection.habitId,
      screenshotUserId,
      JSON.stringify(reflection.options),
      reflection.notes,
      shiftDate(now, -index).toISOString(),
    );
  }

  await savePreference(seedKey, seedVersion);
  await savePreference("analyticsRangeDays", "30");
  await savePreference("remindersEnabled", "false");
  if (locale) {
    await savePreference("languageOverride", locale);
  }
}

function shiftDate(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(date.getDate() + days);
  return next;
}
