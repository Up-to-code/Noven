import * as SQLite from "expo-sqlite";

import type { Habit, HabitLog, Reflection } from "@/types";

const databaseName = "noven.db";
const localUserId = "local-user";

let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;

type ProfileRow = {
  avatar_id: string | null;
  focus_goal: string | null;
  id: string;
  mbti: string | null;
  name: string;
  updated_at: string;
};

type HabitRow = {
  category: Habit["category"];
  created_at: string;
  description: string;
  frequency: string;
  id: string;
  progress: number;
  reminder_time: string | null;
  title: string;
  updated_at: string;
  user_id: string | null;
};

type HabitLogRow = {
  completed_at: string;
  habit_id: string;
  id: string;
  reflection_id: string | null;
  user_id: string;
};

type ReflectionRow = {
  created_at: string;
  habit_id: string | null;
  id: string;
  notes: string | null;
  options_json: string;
  user_id: string;
};

type PreferenceRow = {
  key: string;
  value: string;
};

export async function getDatabase() {
  databasePromise ??= openAndMigrateDatabase();
  return databasePromise;
}

async function openAndMigrateDatabase() {
  const db = await SQLite.openDatabaseAsync(databaseName);
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL DEFAULT '',
      avatar_id TEXT,
      mbti TEXT,
      focus_goal TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL,
      frequency TEXT NOT NULL,
      reminder_time TEXT,
      progress REAL NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reflections (
      id TEXT PRIMARY KEY NOT NULL,
      habit_id TEXT,
      user_id TEXT NOT NULL,
      options_json TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habit_logs (
      id TEXT PRIMARY KEY NOT NULL,
      habit_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      completed_at TEXT NOT NULL,
      reflection_id TEXT
    );

    CREATE TABLE IF NOT EXISTS preferences (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  await db.runAsync(
    `INSERT OR IGNORE INTO preferences (key, value) VALUES (?, ?)`,
    "remindersEnabled",
    "false",
  );

  await ensureColumn(db, "user_profile", "avatar_id", "TEXT");

  await purgeLegacyDemoHabits(db);
  await purgeDuplicateHabits(db);

  return db;
}

async function ensureColumn(
  db: SQLite.SQLiteDatabase,
  tableName: string,
  columnName: string,
  columnDefinition: string,
) {
  const columns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(${tableName})`);
  if (columns.some((column) => column.name === columnName)) {
    return;
  }

  await db.execAsync(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
}

async function purgeLegacyDemoHabits(db: SQLite.SQLiteDatabase) {
  const migrationKey = "legacyDemoHabitsPurged";
  const migration = await db.getFirstAsync<PreferenceRow>("SELECT key, value FROM preferences WHERE key = ?", migrationKey);
  if (migration?.value === "true") {
    return;
  }

  const legacyTitles = ["Deep Work", "Reflection", "Morning Reset"];
  const placeholders = legacyTitles.map(() => "?").join(", ");
  const rows = await db.getAllAsync<{ id: string }>(
    `SELECT id FROM habits WHERE title IN (${placeholders})`,
    ...legacyTitles,
  );

  if (!rows.length) {
    await db.runAsync(`INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)`, migrationKey, "true");
    return;
  }

  const habitIds = rows.map((row) => row.id);
  const habitPlaceholders = habitIds.map(() => "?").join(", ");
  await db.runAsync(`DELETE FROM reflections WHERE habit_id IN (${habitPlaceholders})`, ...habitIds);
  await db.runAsync(`DELETE FROM habit_logs WHERE habit_id IN (${habitPlaceholders})`, ...habitIds);
  await db.runAsync(`DELETE FROM habits WHERE id IN (${habitPlaceholders})`, ...habitIds);
  await db.runAsync(`INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)`, migrationKey, "true");
}

async function purgeDuplicateHabits(db: SQLite.SQLiteDatabase) {
  const rows = await db.getAllAsync<HabitRow>("SELECT * FROM habits ORDER BY created_at ASC");
  const seen = new Set<string>();
  const duplicateIds: string[] = [];

  rows.forEach((row) => {
    const key = [
      row.title.trim().replace(/\s+/g, " ").toLowerCase(),
      row.category,
      row.frequency,
      row.reminder_time || "",
    ].join("|");

    if (seen.has(key)) {
      duplicateIds.push(row.id);
      return;
    }

    seen.add(key);
  });

  if (!duplicateIds.length) {
    return;
  }

  const placeholders = duplicateIds.map(() => "?").join(", ");
  await db.runAsync(`DELETE FROM reflections WHERE habit_id IN (${placeholders})`, ...duplicateIds);
  await db.runAsync(`DELETE FROM habit_logs WHERE habit_id IN (${placeholders})`, ...duplicateIds);
  await db.runAsync(`DELETE FROM habits WHERE id IN (${placeholders})`, ...duplicateIds);
}

export async function loadLocalProfile() {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ProfileRow>(
    "SELECT id, name, avatar_id, mbti, focus_goal, updated_at FROM user_profile WHERE id = ? LIMIT 1",
    localUserId,
  );
  const row = rows[0];
  if (!row) {
    return { name: "", selectedMbti: undefined, selectedFocus: undefined };
  }

  return {
    avatarId: row.avatar_id || undefined,
    name: row.name,
    selectedMbti: row.mbti || undefined,
    selectedFocus: row.focus_goal || undefined,
  };
}

export async function saveLocalProfile(profile: {
  avatarId?: string;
  name: string;
  selectedFocus?: string;
  selectedMbti?: string;
}) {
  const db = await getDatabase();
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO user_profile (id, name, avatar_id, mbti, focus_goal, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       avatar_id = excluded.avatar_id,
       mbti = excluded.mbti,
       focus_goal = excluded.focus_goal,
       updated_at = excluded.updated_at`,
    localUserId,
    profile.name,
    profile.avatarId || null,
    profile.selectedMbti || null,
    profile.selectedFocus || null,
    now,
    now,
  );
}

export async function resetLocalProfile() {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM user_profile WHERE id = ?", localUserId);
}

export async function resetLocalData() {
  const db = await getDatabase();
  await db.execAsync(`
    DELETE FROM user_profile;
    DELETE FROM reflections;
    DELETE FROM habit_logs;
    DELETE FROM habits;
    DELETE FROM preferences;
  `);

  await db.runAsync(
    `INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)`,
    "remindersEnabled",
    "false",
  );
}

export async function loadHabits() {
  const db = await getDatabase();
  const rows = await db.getAllAsync<HabitRow>("SELECT * FROM habits ORDER BY created_at ASC");
  return rows.map(rowToHabit);
}

export async function saveHabit(habit: Habit, existingDb?: SQLite.SQLiteDatabase) {
  const db = existingDb || (await getDatabase());
  await db.runAsync(
    `INSERT INTO habits (id, user_id, title, description, category, frequency, reminder_time, progress, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       user_id = excluded.user_id,
       title = excluded.title,
       description = excluded.description,
       category = excluded.category,
       frequency = excluded.frequency,
       reminder_time = excluded.reminder_time,
       progress = excluded.progress,
       updated_at = excluded.updated_at`,
    habit.id,
    habit.userId || localUserId,
    habit.title,
    habit.description,
    habit.category,
    habit.frequency,
    habit.reminderTime || null,
    habit.progress,
    habit.createdAt,
    habit.updatedAt,
  );
}

export async function deleteHabit(habitId: string) {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM reflections WHERE habit_id = ?", habitId);
  await db.runAsync("DELETE FROM habit_logs WHERE habit_id = ?", habitId);
  await db.runAsync("DELETE FROM habits WHERE id = ?", habitId);
}

export async function loadHabitLogs() {
  const db = await getDatabase();
  const rows = await db.getAllAsync<HabitLogRow>("SELECT * FROM habit_logs ORDER BY completed_at DESC");
  return rows.map(rowToHabitLog);
}

export async function saveHabitLog(log: HabitLog) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO habit_logs (id, habit_id, user_id, completed_at, reflection_id)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       habit_id = excluded.habit_id,
       user_id = excluded.user_id,
       completed_at = excluded.completed_at,
       reflection_id = excluded.reflection_id`,
    log.id,
    log.habitId,
    log.userId,
    log.completedAt,
    log.reflectionId || null,
  );
}

export async function loadReflections() {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ReflectionRow>("SELECT * FROM reflections ORDER BY created_at DESC");
  return rows.map(rowToReflection);
}

export async function saveReflection(reflection: Reflection) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO reflections (id, habit_id, user_id, options_json, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       habit_id = excluded.habit_id,
       user_id = excluded.user_id,
       options_json = excluded.options_json,
       notes = excluded.notes`,
    reflection.id,
    reflection.habitId || null,
    reflection.userId,
    JSON.stringify(reflection.options),
    reflection.notes || null,
    reflection.createdAt,
  );
}

export async function loadPreferences() {
  const db = await getDatabase();
  const rows = await db.getAllAsync<PreferenceRow>("SELECT key, value FROM preferences");
  const preferences = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  return {
    analyticsRangeDays: Number(preferences.analyticsRangeDays || 30),
    largeTextEnabled: preferences.largeTextEnabled === "true",
    milestoneAlertsEnabled: preferences.milestoneAlertsEnabled !== "false",
    reducedMotionEnabled: preferences.reducedMotionEnabled === "true",
    reflectionPromptsEnabled: preferences.reflectionPromptsEnabled !== "false",
    remindersEnabled: preferences.remindersEnabled === "true",
    scheduledHabitNotificationIds: preferences.scheduledHabitNotificationIds,
  };
}

export async function savePreference(key: string, value: string | boolean) {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT INTO preferences (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    key,
    String(value),
  );
}

export async function loadAppData() {
  const [profile, habits, habitLogs, reflections, preferences] = await Promise.all([
    loadLocalProfile(),
    loadHabits(),
    loadHabitLogs(),
    loadReflections(),
    loadPreferences(),
  ]);

  return { habitLogs, habits, preferences, profile, reflections };
}

function rowToHabit(row: HabitRow): Habit {
  return {
    id: row.id,
    userId: row.user_id || undefined,
    title: row.title,
    description: row.description,
    category: row.category,
    frequency: row.frequency,
    reminderTime: row.reminder_time || undefined,
    progress: row.progress,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToReflection(row: ReflectionRow): Reflection {
  return {
    id: row.id,
    habitId: row.habit_id || undefined,
    userId: row.user_id,
    options: JSON.parse(row.options_json),
    notes: row.notes || undefined,
    createdAt: row.created_at,
  };
}

function rowToHabitLog(row: HabitLogRow): HabitLog {
  return {
    id: row.id,
    habitId: row.habit_id,
    userId: row.user_id,
    completedAt: row.completed_at,
    reflectionId: row.reflection_id || undefined,
  };
}
