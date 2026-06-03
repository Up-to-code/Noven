import { useMemo } from "react";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

export const supportedLocales = [
  "en-US",
  "en-GB",
  "ja-JP",
  "fr-FR",
  "fr-CH",
  "it-IT",
  "pt-PT",
  "pt-BR",
] as const;

export type AppLocale = (typeof supportedLocales)[number];
export type SupportedLocale = "system" | AppLocale;

export const defaultLocale: AppLocale = "en-US";

export const languageOptions: Array<{ labelKey: string; locale: SupportedLocale }> = [
  { locale: "system", labelKey: "settings.language.system" },
  { locale: "en-US", labelKey: "settings.language.enUS" },
  { locale: "en-GB", labelKey: "settings.language.enGB" },
  { locale: "ja-JP", labelKey: "settings.language.jaJP" },
  { locale: "fr-FR", labelKey: "settings.language.frFR" },
  { locale: "fr-CH", labelKey: "settings.language.frCH" },
  { locale: "it-IT", labelKey: "settings.language.itIT" },
  { locale: "pt-PT", labelKey: "settings.language.ptPT" },
  { locale: "pt-BR", labelKey: "settings.language.ptBR" },
];

const enUS = {
  common: {
    add: "Add",
    back: "Back",
    cancel: "Cancel",
    close: "Close",
    continue: "Continue",
    createHabit: "Create habit",
    discoverHabits: "Discover habits",
    privacy: "Privacy",
    privacyPolicy: "Privacy Policy",
    reset: "Reset",
    terms: "Terms",
  },
  tabs: {
    home: "Home",
    habits: "Habits",
    patterns: "Patterns",
    profile: "Profile",
  },
  categories: {
    Focus: "Focus",
    Mind: "Mind",
    Energy: "Energy",
    Routine: "Routine",
  },
  focusOptions: {
    betterFocus: "Better focus",
    consistency: "Consistency",
    mentalClarity: "Mental clarity",
    routineBuilding: "Routine building",
    energyBalance: "Energy balance",
    deepWork: "Deep work",
    custom: "Custom",
  },
  families: {
    personal: "personal",
    strategic: "strategic",
    reflective: "reflective",
    structured: "structured",
    adaptive: "adaptive",
  },
  onboarding: {
    welcomeTitle: "Understand your mind.\nDesign your life.",
    welcomeSubtitle: "A personality-driven system for habits that truly fit you.",
    legalNotice: "By continuing, you agree to Noven's terms and privacy policy.",
    nameTitle: "Let's start with your name.",
    nameSubtitle: "What should we call you?",
    namePlaceholder: "Your name",
    nameRequired: "Enter your name",
    mbtiTitle: "{{prefix}}what's your MBTI type?",
    mbtiSubtitle: "This helps personalize your system.",
    selectOne: "SELECT ONE",
    unknownMbti: "I don't know yet",
    focusTitle: "{{prefix}}what should your system support first?",
    focusSubtitle: "Choose what matters most right now.",
    customFocusTitle: "{{prefix}}name your focus.",
    customFocusSubtitle: "Add the thing you want your system to support.",
    customFocusPlaceholder: "Your focus",
    customFocusRequired: "Add a focus to continue",
    aboutNamedTitle: "Here's your Noven, {{name}}.",
    aboutTitle: "Here's what Noven is.",
    aboutSubtitle: "A calm {{family}} system shaped{{focus}}.",
    aboutFocus: " around {{focus}}",
    featurePersonalizedTitle: "Personalized",
    featurePersonalizedBody: "Built around how your mind works.",
    featureAdaptiveTitle: "Adaptive",
    featureAdaptiveBody: "Changes as your habits evolve.",
    featureMinimalTitle: "Minimal",
    featureMinimalBody: "Clarity over complexity.",
    futureTitle: "{{title}}\nYour life.",
    futureFallbackTitle: "Your system.",
    futureNamedTitle: "{{name}}, your system.",
    futureFocusSubtitle: "Let's build around {{focus}}.",
    futureSubtitle: "Let's build a system that truly fits you.",
    begin: "Let's Begin",
  },
  home: {
    fallbackName: "there",
    personalSystem: "PERSONAL SYSTEM",
    greeting: "Good evening, {{name}}.",
    focusTextFallback: "Create one habit",
    todayProgress: "TODAY PROGRESS",
    todayCount: "{{completed}}/{{total}} today",
    adaptiveHabits: "ADAPTIVE HABITS",
    addFirstHabit: "Add first habit",
    exportPrompt: "Export prompt",
    homeInsight: "{{family}} rhythm · {{focus}}",
    homeInsightFallback: "{{family}} rhythm · Protect what matters.",
  },
  habits: {
    title: "Habits",
    subtitle: "Small routines for the system you are building.",
    activeSystem: "ACTIVE SYSTEM",
    addFirstHabit: "Add your first habit",
    createTitle: "Create",
    editTitle: "Edit",
    stepLabel: "STEP {{step}}",
    steps: {
      name: "Name",
      type: "Type",
      time: "Time",
      repeat: "Repeat",
    },
    nameTitle: "Name the habit",
    nameSubtitle: "Keep it short enough to recognize at a glance.",
    nameEditSubtitle: "Update the name you want to see on this goal.",
    namePlaceholder: "Habit name",
    nameRequired: "Habit name is required",
    shapeTitle: "Choose its shape",
    shapeSubtitle: "Pick the closest habit family.",
    shapeNamedSubtitle: "{{title}} belongs closest to...",
    reminderTitle: "Set the reminder",
    reminderSubtitle: "A quiet nudge at the moment it fits.",
    reminderEditSubtitle: "Move the nudge to the moment it fits best.",
    rhythmTitle: "Tune the rhythm",
    rhythmSubtitle: "Small repetition, spaced enough to stay useful.",
    rhythmEditSubtitle: "Change the repetition count and spacing.",
    timesPerDay: "Times per day",
    gapBetween: "Gap between",
    saveHabit: "Save Habit",
    saveChanges: "Save Changes",
    setupTitle: "You're all set.",
    setupSubtitle: "Your habit has been added to your system.",
    setupBody: "Start with one quiet repetition today.",
    startToday: "Start Today",
    addAnother: "Add Another Habit",
    discoverTitle: "Discover habits",
    discoverSubtitle: "Recommended routines for your current system.",
    addHabit: "Add Habit",
    noRecommendations: "No recommendations yet.",
    noRecommendationsBody: "Create your own habit for this category.",
    notFoundTitle: "Habit not found",
    notFoundBody: "This habit may have been removed.",
    deleteTitle: "Delete goal?",
    deleteBody: "This removes the goal and its local reflections.",
    deleteAction: "Delete",
    actionsLabel: "Goal actions",
    editSettings: "Edit habit settings",
    deleteGoal: "Delete goal",
    about: "ABOUT THIS HABIT",
    reminders: "REMINDERS",
    weeklyProgress: "WEEKLY PROGRESS",
    frequency: "{{count}} time daily, spaced by {{hours}}h.",
    frequency_plural: "{{count}} times daily, spaced by {{hours}}h.",
    dailyFrequency: "{{count}}x daily",
    streak: "Current streak",
    bestDay: "Best day",
    completion: "completion",
    completion_plural: "completions",
    noWeeklyCompletions: "No completions yet this week.",
    weeklyCompletions: "Completed on {{days}}.",
    swipeComplete: "Slide to complete",
  },
  reflection: {
    title: "Reflection",
    heading: "How did it go?",
    subtitle: "Pick what shaped the habit today.",
    placeholder: "Write an optional reflection...",
    save: "Save Reflection",
    options: {
      feltFocused: "Felt focused",
      hadEnoughTime: "Had enough time",
      feltStressed: "Felt stressed",
      wasDistracted: "Was distracted",
      forgot: "Forgot",
      notInMood: "Not in the mood",
    },
  },
  milestone: {
    title: "Nice work.",
    subtitle: "You completed {{habit}} today.",
    streakLabel: "CURRENT STREAK",
    streakValue: "{{count}} day",
    streakValue_plural: "{{count}} days",
    viewProgress: "View Progress",
  },
  patterns: {
    analytics: "ANALYTICS",
    title: "Patterns",
    days: "{{count}} day",
    days_plural: "{{count}} days",
    less: "Less",
    more: "More",
  },
  profile: {
    profile: "PROFILE",
    yourProfile: "Your profile",
    habitCount: "{{count}} habit",
    habitCount_plural: "{{count}} habits",
    editAvatar: "Edit avatar",
    editName: "Edit name",
    editType: "Edit type",
    manageSubscription: "Manage subscription",
    upgradePremium: "Upgrade to Premium",
    allSettings: "All settings",
    avatarTitle: "Avatar",
    profileStyle: "PROFILE STYLE",
    chooseMark: "Choose your mark",
    avatarSubtitle: "Pick the visual mark that feels most like your system.",
    avatars: {
      strategist: "Strategist",
      observer: "Observer",
      builder: "Builder",
      dreamer: "Dreamer",
      custom: "Custom",
    },
  },
  settings: {
    title: "Settings",
    identity: "IDENTITY",
    name: "Name",
    mbti: "MBTI",
    focus: "Focus",
    add: "Add",
    choose: "Choose",
    notifications: "NOTIFICATIONS",
    habitReminders: "Habit reminders",
    reminderTimes: "Reminder times",
    on: "On",
    off: "Off",
    timeCount: "{{count}} time",
    timeCount_plural: "{{count}} times",
    setInHabits: "Set in habits",
    localData: "LOCAL DATA",
    localSummary: "{{habits}} habit · {{completions}} completion · {{reflections}} reflection",
    localSummary_plural: "{{habits}} habits · {{completions}} completions · {{reflections}} reflections",
    analytics: "ANALYTICS",
    patternRange: "Pattern range",
    daysShort: "{{count}}d",
    appInfo: "APP INFO",
    active: "Active",
    unlock: "Unlock",
    localOnly: "Local only",
    use: "Use",
    exportPrompt: "Export Prompt",
    resetLocalData: "Reset Local Data",
    language: {
      section: "LANGUAGE",
      row: "Language",
      title: "Choose language.",
      subtitle: "Select how Noven should speak across every screen.",
      system: "System / Phone language",
      enUS: "English (US)",
      enGB: "English (UK)",
      jaJP: "Japanese",
      frFR: "French",
      frCH: "French (Switzerland)",
      itIT: "Italian",
      ptPT: "Portuguese (Portugal)",
      ptBR: "Portuguese (Brazil)",
      groups: {
        device: "Device",
        asia: "Asia",
        europe: "Europe",
        americas: "Americas",
      },
    },
    editNameTitle: "Edit name.",
    editNameSubtitle: "This is how Noven greets you.",
    saveName: "Save Name",
    editFocusTitle: "Edit focus.",
    editFocusSubtitle: "Update what your system is supporting.",
    saveFocus: "Save Focus",
    editTypeTitle: "Edit type.",
    editTypeSubtitle: "Choose the MBTI type you want Noven to use.",
    allowRemindersTitle: "Allow habit reminders?",
    allowRemindersBody: "Noven uses local notifications only for the habit reminder times you set. You can turn them off here at any time.",
    notNow: "Not Now",
    notificationsOffTitle: "Notifications are off",
    notificationsOffBody: "Allow notifications in iOS Settings to receive habit reminders.",
    notificationsDebugTitle: "Notification debug",
    notificationsDebugBody: "{{scheduled}} native · {{saved}} saved · permission {{permission}}",
    resetTitle: "Reset local data?",
    resetBody: "This clears your profile, habits, logs, and reflections from this device.",
  },
  paywall: {
    title: "Upgrade\nyour journey.",
    subtitle: "Create more than two habits, export your reflection prompt, and see deeper monthly patterns.",
    productsUnavailableTitle: "Products unavailable",
    productsUnavailableBody: "Try again in a moment, or continue without Premium for now.",
    restoredTitle: "Premium restored",
    notRestoredTitle: "Nothing to restore",
    restoredBody: "Noven Premium is active.",
    notRestoredBody: "No active Premium purchase was found for this Apple ID.",
    restore: "Restore purchases",
    secure: "Secure payment. Cancel anytime.",
    perMonth: "/ month",
    perYear: "/ year",
    includesTitle: "Noven Premium includes",
    benefitUnlimited: "Unlimited habit creation beyond the free two-habit limit.",
    benefitPrompt: "Prompt export from your local habit history and reflections.",
    benefitPatterns: "Advanced monthly pattern details for your habit progress.",
    renewal: "Auto-renews {{period}} through your Apple ID until canceled in App Store subscription settings.",
    monthlyBilling: "monthly",
    yearlyBilling: "yearly",
    selectedPlan: "for the selected plan",
  },
  legal: {
    privacyTitle: "Privacy",
    privacyHeading: "Your data stays on your device.",
    privacySubtitle: "Noven is local-first for habits and reflections. Premium purchases are handled by Apple and Adapty.",
    termsTitle: "Terms",
    termsHeading: "Simple terms for a local app.",
    termsSubtitle: "Use Noven as a personal habit tool. Keep anything sensitive out of exported text unless you choose to share it.",
    sections: {
      localData: "Local data",
      localDataBody: "Your habits, profile, logs, and reflections are stored locally on this device.",
      purchases: "Purchases",
      purchasesBody:
        "Noven Premium is an optional auto-renewable subscription billed by Apple. Premium unlocks unlimited habit creation beyond the free two-habit limit, prompt export, and advanced monthly pattern details. You can manage or cancel your subscription from your Apple ID subscription settings. Noven does not store payment card details.",
      exports: "Exports",
      exportsBody: "If you export a prompt or share text, you choose what leaves the device.",
      personalUse: "Personal use",
      personalUseBody: "Noven is a self-guided habit companion, not medical, financial, or professional advice.",
      appleEula: "Apple standard EULA",
      appleEulaBody: "Noven uses Apple's standard End User License Agreement unless a custom EULA is provided in App Store Connect.",
      responsibility: "Your responsibility",
      responsibilityBody: "You are responsible for the text you enter and choose to export.",
      changes: "Changes",
      changesBody: "Terms may change as Noven evolves. Continued use means you accept the latest version.",
    },
  },
  prompt: {
    title: "Prompt",
    heading: "Export a prompt.",
    markdownTitle: "Noven Personal Data Prompt",
    range: "TIME RANGE",
    share: "Share / Copy Prompt",
    unlock: "Unlock Prompt Export",
    premiumTitle: "Premium feature",
    premiumBody: "Unlock prompt export to turn your local habit history into a useful coaching prompt.",
    last7: "7 days",
    last30: "30 days",
    last90: "90 days",
    all: "All",
    subtitle: "{{count}} reflection included from {{range}}.",
    subtitle_plural: "{{count}} reflections included from {{range}}.",
    noReflections: "No reflections in this range yet.",
  },
  error: {
    paused: "Something paused",
    pausedBody: "Go back and try the previous step again.",
    tryAgain: "Try Again",
  },
  loading: {
    building: "Building your system...",
  },
  notifications: {
    channelName: "Habit reminders",
    habitReminderBody: "A small repetition is enough.",
  },
} as const;

type TranslationResource = typeof enUS;

const clone = (resource: TranslationResource): TranslationResource => JSON.parse(JSON.stringify(resource));

const resources: Record<AppLocale, { translation: TranslationResource }> = {
  "en-US": { translation: enUS },
  "en-GB": { translation: clone(enUS) },
  "ja-JP": { translation: clone(enUS) },
  "fr-FR": { translation: clone(enUS) },
  "fr-CH": { translation: clone(enUS) },
  "it-IT": { translation: clone(enUS) },
  "pt-PT": { translation: clone(enUS) },
  "pt-BR": { translation: clone(enUS) },
};

Object.assign(resources["en-GB"].translation.common, { privacyPolicy: "Privacy Policy" });
Object.assign(resources["ja-JP"].translation.common, {
  add: "追加",
  back: "戻る",
  cancel: "キャンセル",
  close: "閉じる",
  continue: "続ける",
  createHabit: "習慣を作成",
  discoverHabits: "習慣を探す",
  privacy: "プライバシー",
  privacyPolicy: "プライバシーポリシー",
  reset: "リセット",
  terms: "利用規約",
});
Object.assign(resources["ja-JP"].translation.tabs, { home: "ホーム", habits: "習慣", patterns: "分析", profile: "プロフ" });
Object.assign(resources["ja-JP"].translation.categories, { Focus: "集中", Mind: "心", Energy: "エネルギー", Routine: "ルーティン" });
Object.assign(resources["ja-JP"].translation.focusOptions, {
  betterFocus: "集中力を高める",
  consistency: "継続する",
  mentalClarity: "頭をすっきりさせる",
  routineBuilding: "ルーティン作り",
  energyBalance: "エネルギー調整",
  deepWork: "深い作業",
  custom: "カスタム",
});
Object.assign(resources["ja-JP"].translation.families, {
  personal: "個人向け",
  strategic: "戦略的",
  reflective: "内省的",
  structured: "構造的",
  adaptive: "適応型",
});
Object.assign(resources["ja-JP"].translation.settings.language, {
  title: "言語を選ぶ。",
  subtitle: "Novenのすべての画面で使う言語を選択します。",
  system: "システム / 端末の言語",
  enUS: "英語（米国）",
  enGB: "英語（英国）",
  jaJP: "日本語",
  frFR: "フランス語",
  frCH: "フランス語（スイス）",
  itIT: "イタリア語",
  ptPT: "ポルトガル語（ポルトガル）",
  ptBR: "ポルトガル語（ブラジル）",
  groups: {
    device: "端末",
    asia: "アジア",
    europe: "ヨーロッパ",
    americas: "アメリカ",
  },
});
Object.assign(resources["ja-JP"].translation.onboarding, {
  welcomeTitle: "自分の心を理解し、\n人生を設計する。",
  welcomeSubtitle: "あなたに本当に合う習慣のための、性格に基づくシステム。",
  legalNotice: "続けると、Novenの利用規約とプライバシーポリシーに同意したことになります。",
  nameTitle: "まず名前を教えてください。",
  nameSubtitle: "何と呼べばいいですか？",
  namePlaceholder: "あなたの名前",
  nameRequired: "名前を入力してください",
  mbtiTitle: "{{prefix}}MBTIタイプは？",
  mbtiSubtitle: "あなたに合わせたシステム作りに役立ちます。",
  selectOne: "1つ選択",
  unknownMbti: "まだわからない",
  focusTitle: "{{prefix}}最初に支えたいことは？",
  focusSubtitle: "今いちばん大切なことを選びましょう。",
  customFocusTitle: "{{prefix}}フォーカスに名前をつける。",
  customFocusSubtitle: "システムで支えたいことを追加しましょう。",
  customFocusPlaceholder: "あなたのフォーカス",
  customFocusRequired: "続けるにはフォーカスを入力してください",
  aboutNamedTitle: "{{name}}さんのNovenです。",
  aboutTitle: "Novenについて。",
  aboutSubtitle: "{{family}}システム{{focus}}。",
  aboutFocus: "（{{focus}}を中心に）",
  featurePersonalizedTitle: "パーソナル",
  featurePersonalizedBody: "あなたの思考の働き方に合わせます。",
  featureAdaptiveTitle: "適応型",
  featureAdaptiveBody: "習慣の変化に合わせて変わります。",
  featureMinimalTitle: "ミニマル",
  featureMinimalBody: "複雑さより明快さを大切にします。",
  futureTitle: "{{title}}\nあなたの生活。",
  futureFallbackTitle: "あなたのシステム。",
  futureNamedTitle: "{{name}}さんのシステム。",
  futureFocusSubtitle: "{{focus}}を中心に作りましょう。",
  futureSubtitle: "あなたに本当に合うシステムを作りましょう。",
  begin: "始める",
});
Object.assign(resources["ja-JP"].translation.home, {
  fallbackName: "あなた",
  personalSystem: "個人システム",
  greeting: "こんばんは、{{name}}。",
  focusTextFallback: "習慣を1つ作る",
  todayProgress: "今日の進捗",
  todayCount: "今日 {{completed}}/{{total}}",
  adaptiveHabits: "適応型の習慣",
  addFirstHabit: "最初の習慣を追加",
  exportPrompt: "プロンプトを書き出す",
  homeInsight: "{{family}}リズム・{{focus}}",
  homeInsightFallback: "{{family}}リズム・大切なものを守る",
});
Object.assign(resources["ja-JP"].translation.habits, {
  title: "習慣",
  subtitle: "作っているシステムのための小さなルーティン。",
  activeSystem: "アクティブなシステム",
  addFirstHabit: "最初の習慣を追加",
  createTitle: "作成",
  editTitle: "編集",
  stepLabel: "ステップ {{step}}",
  steps: { name: "名前", type: "タイプ", time: "時間", repeat: "繰り返し" },
  nameTitle: "習慣に名前をつける",
  nameSubtitle: "ひと目でわかる短い名前にしましょう。",
  nameEditSubtitle: "この目標に表示する名前を更新します。",
  namePlaceholder: "習慣名",
  nameRequired: "習慣名は必須です",
  shapeTitle: "形を選ぶ",
  shapeSubtitle: "いちばん近い習慣カテゴリを選びましょう。",
  shapeNamedSubtitle: "{{title}}にいちばん近いものは...",
  reminderTitle: "リマインダーを設定",
  reminderSubtitle: "合うタイミングで静かに知らせます。",
  reminderEditSubtitle: "通知をいちばん合う時間に移動します。",
  rhythmTitle: "リズムを整える",
  rhythmSubtitle: "小さく、続けやすい間隔で。",
  rhythmEditSubtitle: "回数と間隔を変更します。",
  timesPerDay: "1日の回数",
  gapBetween: "間隔",
  saveHabit: "習慣を保存",
  saveChanges: "変更を保存",
  setupTitle: "準備できました。",
  setupSubtitle: "習慣がシステムに追加されました。",
  setupBody: "今日は小さな1回から始めましょう。",
  startToday: "今日始める",
  addAnother: "別の習慣を追加",
  discoverTitle: "習慣を探す",
  discoverSubtitle: "今のシステムに合うおすすめのルーティン。",
  addHabit: "習慣を追加",
  noRecommendations: "まだおすすめはありません。",
  noRecommendationsBody: "このカテゴリの習慣を自分で作成しましょう。",
  notFoundTitle: "習慣が見つかりません",
  notFoundBody: "この習慣は削除された可能性があります。",
  deleteTitle: "目標を削除しますか？",
  deleteBody: "この目標とローカルの振り返りを削除します。",
  deleteAction: "削除",
  actionsLabel: "目標アクション",
  editSettings: "習慣設定を編集",
  deleteGoal: "目標を削除",
  about: "この習慣について",
  reminders: "リマインダー",
  weeklyProgress: "週間進捗",
  frequency: "1日{{count}}回、{{hours}}時間おき。",
  frequency_plural: "1日{{count}}回、{{hours}}時間おき。",
  dailyFrequency: "1日{{count}}回",
  streak: "現在の連続記録",
  bestDay: "ベスト日",
  completion: "完了",
  completion_plural: "完了",
  noWeeklyCompletions: "今週はまだ完了がありません。",
  weeklyCompletions: "{{days}}に完了。",
  swipeComplete: "スライドして完了",
});
Object.assign(resources["ja-JP"].translation.reflection, {
  title: "振り返り",
  heading: "どうでしたか？",
  subtitle: "今日の習慣に影響したものを選びましょう。",
  placeholder: "任意の振り返りを書く...",
  save: "振り返りを保存",
  options: {
    feltFocused: "集中できた",
    hadEnoughTime: "時間があった",
    feltStressed: "ストレスがあった",
    wasDistracted: "気が散った",
    forgot: "忘れた",
    notInMood: "気分ではなかった",
  },
});
Object.assign(resources["ja-JP"].translation.milestone, {
  title: "いい調子です。",
  subtitle: "今日は{{habit}}を完了しました。",
  streakLabel: "現在の連続記録",
  streakValue: "{{count}}日",
  streakValue_plural: "{{count}}日",
  viewProgress: "進捗を見る",
});
Object.assign(resources["ja-JP"].translation.patterns, {
  analytics: "分析",
  title: "パターン",
  days: "{{count}}日",
  days_plural: "{{count}}日",
  less: "少ない",
  more: "多い",
});
Object.assign(resources["ja-JP"].translation.profile, {
  profile: "プロフィール",
  yourProfile: "あなたのプロフィール",
  habitCount: "{{count}}個の習慣",
  habitCount_plural: "{{count}}個の習慣",
  editAvatar: "アバターを編集",
  editName: "名前を編集",
  editType: "タイプを編集",
  manageSubscription: "サブスクリプション管理",
  upgradePremium: "Premiumにアップグレード",
  allSettings: "すべての設定",
  avatarTitle: "アバター",
  profileStyle: "プロフィールスタイル",
  chooseMark: "マークを選ぶ",
  avatarSubtitle: "あなたのシステムに合う見た目を選びましょう。",
  avatars: {
    strategist: "戦略家",
    observer: "観察者",
    builder: "ビルダー",
    dreamer: "夢見る人",
    custom: "カスタム",
  },
});
Object.assign(resources["ja-JP"].translation.settings, {
  title: "設定",
  identity: "アイデンティティ",
  name: "名前",
  mbti: "MBTI",
  focus: "フォーカス",
  add: "追加",
  choose: "選択",
  notifications: "通知",
  habitReminders: "習慣リマインダー",
  reminderTimes: "リマインダー時間",
  on: "オン",
  off: "オフ",
  timeCount: "{{count}}回",
  timeCount_plural: "{{count}}回",
  setInHabits: "習慣で設定",
  localData: "ローカルデータ",
  localSummary: "{{habits}}個の習慣・{{completions}}回完了・{{reflections}}件の振り返り",
  localSummary_plural: "{{habits}}個の習慣・{{completions}}回完了・{{reflections}}件の振り返り",
  analytics: "分析",
  patternRange: "パターン範囲",
  daysShort: "{{count}}日",
  appInfo: "アプリ情報",
  active: "有効",
  unlock: "解除",
  localOnly: "端末内のみ",
  use: "使用",
  exportPrompt: "プロンプトを書き出す",
  resetLocalData: "ローカルデータをリセット",
  language: { ...resources["ja-JP"].translation.settings.language, section: "言語", row: "言語" },
  editNameTitle: "名前を編集。",
  editNameSubtitle: "Novenがあなたを呼ぶ名前です。",
  saveName: "名前を保存",
  editFocusTitle: "フォーカスを編集。",
  editFocusSubtitle: "システムが支える対象を更新します。",
  saveFocus: "フォーカスを保存",
  editTypeTitle: "タイプを編集。",
  editTypeSubtitle: "Novenが使うMBTIタイプを選びます。",
  allowRemindersTitle: "習慣リマインダーを許可しますか？",
  allowRemindersBody: "Novenは設定した習慣時間にだけローカル通知を使います。いつでもオフにできます。",
  notNow: "今はしない",
  notificationsOffTitle: "通知がオフです",
  notificationsOffBody: "習慣リマインダーを受け取るにはiOS設定で通知を許可してください。",
  notificationsDebugTitle: "通知デバッグ",
  notificationsDebugBody: "ネイティブ {{scheduled}}件・保存 {{saved}}件・権限 {{permission}}",
  resetTitle: "ローカルデータをリセットしますか？",
  resetBody: "この端末のプロフィール、習慣、ログ、振り返りを消去します。",
});
Object.assign(resources["ja-JP"].translation.paywall, {
  title: "旅を\nアップグレード。",
  subtitle: "2個以上の習慣作成、振り返りプロンプトの書き出し、月ごとの詳しいパターンを利用できます。",
  productsUnavailableTitle: "商品を読み込めません",
  productsUnavailableBody: "少し待ってからもう一度お試しください。",
  restoredTitle: "Premiumを復元しました",
  notRestoredTitle: "復元できる購入がありません",
  restoredBody: "Noven Premiumが有効です。",
  notRestoredBody: "このApple IDに有効なPremium購入は見つかりませんでした。",
  restore: "購入を復元",
  secure: "安全な支払い。いつでも解約できます。",
  perMonth: "/月",
  perYear: "/年",
  includesTitle: "Noven Premiumに含まれるもの",
  benefitUnlimited: "無料の2個制限を超えて、習慣を無制限に作成できます。",
  benefitPrompt: "ローカルの習慣履歴と振り返りからプロンプトを書き出せます。",
  benefitPatterns: "習慣の進捗について、月ごとの詳細パターンを確認できます。",
  renewal: "Apple IDを通じて{{period}}自動更新されます。App Storeのサブスクリプション設定で解約できます。",
  monthlyBilling: "毎月",
  yearlyBilling: "毎年",
  selectedPlan: "選択したプランで",
});
Object.assign(resources["ja-JP"].translation.legal, {
  privacyTitle: "プライバシー",
  privacyHeading: "データは端末に保存されます。",
  privacySubtitle: "Novenは習慣と振り返りを端末内中心で扱います。Premium購入はAppleとAdaptyで処理されます。",
  termsTitle: "利用規約",
  termsHeading: "ローカルアプリのシンプルな規約。",
  termsSubtitle: "Novenを個人の習慣ツールとして使用してください。共有する内容は自分で選択します。",
  sections: {
    localData: "ローカルデータ",
    localDataBody: "あなたの習慣、プロフィール、ログ、振り返りはこの端末に保存されます。",
    purchases: "購入",
    purchasesBody:
      "Noven PremiumはAppleを通じて請求される任意の自動更新サブスクリプションです。Premiumでは、無料の2個制限を超える習慣作成、プロンプトの書き出し、月ごとの詳細パターンを利用できます。サブスクリプションはApple IDの設定で管理または解約できます。Novenは支払いカード情報を保存しません。",
    exports: "書き出し",
    exportsBody: "プロンプトやテキストを共有する場合、端末の外に出す内容はあなたが選びます。",
    personalUse: "個人利用",
    personalUseBody: "Novenは自己管理のための習慣ツールであり、医療、金融、専門的な助言ではありません。",
    appleEula: "Apple標準EULA",
    appleEulaBody: "App Store ConnectでカスタムEULAが提供されていない限り、NovenにはAppleの標準エンドユーザー使用許諾契約が適用されます。",
    responsibility: "あなたの責任",
    responsibilityBody: "入力する内容と、書き出しや共有を選ぶテキストについてはあなたが責任を持ちます。",
    changes: "変更",
    changesBody: "Novenの改善に合わせて規約が変更される場合があります。継続して使用すると最新の規約に同意したものとみなされます。",
  },
});
Object.assign(resources["ja-JP"].translation.prompt, {
  title: "プロンプト",
  heading: "プロンプトを書き出す。",
  markdownTitle: "Noven 個人データプロンプト",
  range: "期間",
  share: "共有 / コピー",
  unlock: "書き出しを解除",
  premiumTitle: "Premium機能",
  premiumBody: "ローカルの習慣履歴をコーチング用プロンプトに変換します。",
  last7: "7日",
  last30: "30日",
  last90: "90日",
  all: "すべて",
  subtitle: "{{range}}から{{count}}件の振り返り。",
  subtitle_plural: "{{range}}から{{count}}件の振り返り。",
  noReflections: "この期間の振り返りはまだありません。",
});
Object.assign(resources["ja-JP"].translation.error, { paused: "一時停止しました", pausedBody: "戻って前のステップをもう一度試してください。", tryAgain: "もう一度" });
Object.assign(resources["ja-JP"].translation.loading, { building: "システムを作成中..." });
Object.assign(resources["ja-JP"].translation.notifications, { channelName: "習慣リマインダー", habitReminderBody: "小さな1回で十分です。" });

Object.assign(resources["fr-FR"].translation.common, {
  add: "Ajouter",
  back: "Retour",
  cancel: "Annuler",
  continue: "Continuer",
  createHabit: "Créer une habitude",
  discoverHabits: "Découvrir des habitudes",
  privacy: "Confidentialité",
  privacyPolicy: "Politique de confidentialité",
  reset: "Réinitialiser",
  terms: "Conditions",
});
Object.assign(resources["fr-FR"].translation.tabs, { home: "Accueil", habits: "Habitudes", patterns: "Tendances", profile: "Profil" });
Object.assign(resources["fr-FR"].translation.patterns, {
  analytics: "ANALYSE",
  title: "Tendances",
  days: "{{count}} jour",
  days_plural: "{{count}} jours",
  less: "Moins",
  more: "Plus",
});
Object.assign(resources["fr-FR"].translation.settings.language, {
  title: "Choisir la langue.",
  subtitle: "Sélectionnez la langue utilisée dans Noven.",
  system: "Système / langue du téléphone",
  enUS: "Anglais (États-Unis)",
  enGB: "Anglais (Royaume-Uni)",
  jaJP: "Japonais",
  frFR: "Français",
  frCH: "Français (Suisse)",
  itIT: "Italien",
  ptPT: "Portugais (Portugal)",
  ptBR: "Portugais (Brésil)",
  groups: {
    device: "Appareil",
    asia: "Asie",
    europe: "Europe",
    americas: "Amériques",
  },
});
Object.assign(resources["fr-FR"].translation.onboarding, {
  welcomeTitle: "Comprenez votre esprit.\nDessinez votre vie.",
  welcomeSubtitle: "Un système d'habitudes fondé sur votre personnalité.",
  nameTitle: "Commençons par votre nom.",
  nameSubtitle: "Comment devons-nous vous appeler ?",
  begin: "Commencer",
});
Object.assign(resources["fr-FR"].translation.settings, { title: "Réglages", name: "Nom", focus: "Priorité", language: { ...resources["fr-FR"].translation.settings.language, section: "LANGUE", row: "Langue" } });
Object.assign(resources["fr-FR"].translation.paywall, { title: "Améliorez\nvotre parcours.", subtitle: "Débloquez plus de fonctionnalités et construisez la vie que vous avez imaginée.", restore: "Restaurer les achats" });
Object.assign(resources["fr-FR"].translation.legal, {
  privacyTitle: "Confidentialité",
  privacyHeading: "Vos données restent sur votre appareil.",
  privacySubtitle: "Noven privilégie le stockage local pour les habitudes et les réflexions. Les achats Premium sont traités par Apple et Adapty.",
  termsTitle: "Conditions",
  termsHeading: "Des conditions simples pour une app locale.",
  termsSubtitle: "Utilisez Noven comme outil personnel d'habitudes. Choisissez ce que vous partagez.",
  sections: {
    localData: "Données locales",
    localDataBody: "Vos habitudes, votre profil, vos journaux et vos réflexions sont stockés localement sur cet appareil.",
    purchases: "Achats",
    purchasesBody: "Le statut Premium est traité par Apple et Adapty. Noven ne stocke pas vos données de carte bancaire.",
    exports: "Exports",
    exportsBody: "Si vous exportez un prompt ou partagez du texte, vous choisissez ce qui quitte l'appareil.",
    personalUse: "Usage personnel",
    personalUseBody: "Noven est un compagnon d'habitudes autoguidé, pas un conseil médical, financier ou professionnel.",
    responsibility: "Votre responsabilité",
    responsibilityBody: "Vous êtes responsable du texte que vous saisissez et choisissez d'exporter.",
    changes: "Modifications",
    changesBody: "Les conditions peuvent changer avec l'évolution de Noven. Continuer à utiliser l'app signifie accepter la version la plus récente.",
  },
});
Object.assign(resources["fr-FR"].translation.prompt, {
  title: "Prompt",
  heading: "Exporter un prompt.",
  markdownTitle: "Prompt de donnees personnelles Noven",
  range: "PERIODE",
  share: "Partager / Copier",
  unlock: "Debloquer l'export",
  premiumTitle: "Fonction Premium",
  premiumBody: "Debloquez l'export de prompt pour transformer votre historique local d'habitudes en prompt de coaching utile.",
  last7: "7 jours",
  last30: "30 jours",
  last90: "90 jours",
  all: "Tout",
  subtitle: "{{count}} reflexion incluse depuis {{range}}.",
  subtitle_plural: "{{count}} reflexions incluses depuis {{range}}.",
  noReflections: "Aucune reflexion dans cette periode.",
});
resources["fr-CH"].translation = clone(resources["fr-FR"].translation);
Object.assign(resources["fr-CH"].translation.settings.language, { row: "Langue", frCH: "Français (Suisse)" });

Object.assign(resources["it-IT"].translation.common, {
  add: "Aggiungi",
  back: "Indietro",
  cancel: "Annulla",
  continue: "Continua",
  createHabit: "Crea abitudine",
  discoverHabits: "Scopri abitudini",
  privacy: "Privacy",
  privacyPolicy: "Informativa privacy",
  reset: "Reimposta",
  terms: "Termini",
});
Object.assign(resources["it-IT"].translation.tabs, { home: "Home", habits: "Abitudini", patterns: "Pattern", profile: "Profilo" });
Object.assign(resources["it-IT"].translation.patterns, {
  analytics: "ANALISI",
  title: "Pattern",
  days: "{{count}} giorno",
  days_plural: "{{count}} giorni",
  less: "Meno",
  more: "Più",
});
Object.assign(resources["it-IT"].translation.settings.language, {
  title: "Scegli la lingua.",
  subtitle: "Seleziona la lingua da usare in Noven.",
  system: "Sistema / lingua del telefono",
  enUS: "Inglese (USA)",
  enGB: "Inglese (Regno Unito)",
  jaJP: "Giapponese",
  frFR: "Francese",
  frCH: "Francese (Svizzera)",
  itIT: "Italiano",
  ptPT: "Portoghese (Portogallo)",
  ptBR: "Portoghese (Brasile)",
  groups: {
    device: "Dispositivo",
    asia: "Asia",
    europe: "Europa",
    americas: "Americhe",
  },
});
Object.assign(resources["it-IT"].translation.onboarding, { welcomeTitle: "Comprendi la tua mente.\nDisegna la tua vita.", nameTitle: "Iniziamo dal tuo nome.", begin: "Inizia" });
Object.assign(resources["it-IT"].translation.settings, { title: "Impostazioni", name: "Nome", focus: "Focus", language: { ...resources["it-IT"].translation.settings.language, section: "LINGUA", row: "Lingua" } });
Object.assign(resources["it-IT"].translation.legal, {
  privacyTitle: "Privacy",
  privacyHeading: "I tuoi dati restano sul dispositivo.",
  privacySubtitle: "Noven usa un approccio locale per abitudini e riflessioni. Gli acquisti Premium sono gestiti da Apple e Adapty.",
  termsTitle: "Termini",
  termsHeading: "Termini semplici per un'app locale.",
  termsSubtitle: "Usa Noven come strumento personale per le abitudini. Decidi tu cosa condividere.",
  sections: {
    localData: "Dati locali",
    localDataBody: "Le tue abitudini, il profilo, i log e le riflessioni sono salvati localmente su questo dispositivo.",
    purchases: "Acquisti",
    purchasesBody: "Lo stato Premium è elaborato da Apple e Adapty. Noven non salva i dati della carta di pagamento.",
    exports: "Esportazioni",
    exportsBody: "Se esporti un prompt o condividi testo, scegli tu cosa lascia il dispositivo.",
    personalUse: "Uso personale",
    personalUseBody: "Noven è uno strumento autoguidato per le abitudini, non un consiglio medico, finanziario o professionale.",
    responsibility: "La tua responsabilità",
    responsibilityBody: "Sei responsabile del testo che inserisci e scegli di esportare.",
    changes: "Modifiche",
    changesBody: "I termini possono cambiare con l'evoluzione di Noven. Continuare a usare l'app significa accettare la versione più recente.",
  },
});
Object.assign(resources["it-IT"].translation.prompt, {
  title: "Prompt",
  heading: "Esporta un prompt.",
  markdownTitle: "Prompt dati personali Noven",
  range: "INTERVALLO",
  share: "Condividi / Copia",
  unlock: "Sblocca esportazione",
  premiumTitle: "Funzione Premium",
  premiumBody: "Sblocca l'esportazione del prompt per trasformare la cronologia locale delle abitudini in un prompt di coaching utile.",
  last7: "7 giorni",
  last30: "30 giorni",
  last90: "90 giorni",
  all: "Tutto",
  subtitle: "{{count}} riflessione inclusa da {{range}}.",
  subtitle_plural: "{{count}} riflessioni incluse da {{range}}.",
  noReflections: "Nessuna riflessione in questo intervallo.",
});

Object.assign(resources["pt-PT"].translation.common, {
  add: "Adicionar",
  back: "Voltar",
  cancel: "Cancelar",
  continue: "Continuar",
  createHabit: "Criar hábito",
  discoverHabits: "Descobrir hábitos",
  privacy: "Privacidade",
  privacyPolicy: "Política de Privacidade",
  reset: "Repor",
  terms: "Termos",
});
Object.assign(resources["pt-PT"].translation.tabs, { home: "Início", habits: "Hábitos", patterns: "Padrões", profile: "Perfil" });
Object.assign(resources["pt-PT"].translation.patterns, {
  analytics: "ANÁLISE",
  title: "Padrões",
  days: "{{count}} dia",
  days_plural: "{{count}} dias",
  less: "Menos",
  more: "Mais",
});
Object.assign(resources["pt-PT"].translation.settings.language, {
  title: "Escolha o idioma.",
  subtitle: "Selecione o idioma usado em todo o Noven.",
  system: "Sistema / idioma do telefone",
  enUS: "Inglês (EUA)",
  enGB: "Inglês (Reino Unido)",
  jaJP: "Japonês",
  frFR: "Francês",
  frCH: "Francês (Suíça)",
  itIT: "Italiano",
  ptPT: "Português (Portugal)",
  ptBR: "Português (Brasil)",
  groups: {
    device: "Dispositivo",
    asia: "Ásia",
    europe: "Europa",
    americas: "Américas",
  },
});
Object.assign(resources["pt-PT"].translation.onboarding, { welcomeTitle: "Compreenda a sua mente.\nDesenhe a sua vida.", nameTitle: "Comecemos pelo seu nome.", begin: "Começar" });
Object.assign(resources["pt-PT"].translation.settings, { title: "Definições", name: "Nome", focus: "Foco", language: { ...resources["pt-PT"].translation.settings.language, section: "IDIOMA", row: "Idioma" } });
Object.assign(resources["pt-PT"].translation.legal, {
  privacyTitle: "Privacidade",
  privacyHeading: "Os seus dados ficam no dispositivo.",
  privacySubtitle: "A Noven funciona primeiro localmente para hábitos e reflexões. As compras Premium são processadas pela Apple e pela Adapty.",
  termsTitle: "Termos",
  termsHeading: "Termos simples para uma app local.",
  termsSubtitle: "Use a Noven como uma ferramenta pessoal de hábitos. Escolhe o que quer partilhar.",
  sections: {
    localData: "Dados locais",
    localDataBody: "Os seus hábitos, perfil, registos e reflexões são guardados localmente neste dispositivo.",
    purchases: "Compras",
    purchasesBody: "O estado Premium é processado pela Apple e pela Adapty. A Noven não guarda dados de cartões de pagamento.",
    exports: "Exportações",
    exportsBody: "Se exportar um prompt ou partilhar texto, escolhe o que sai do dispositivo.",
    personalUse: "Uso pessoal",
    personalUseBody: "A Noven é uma ferramenta autoguiada de hábitos, não aconselhamento médico, financeiro ou profissional.",
    responsibility: "A sua responsabilidade",
    responsibilityBody: "É responsável pelo texto que introduz e escolhe exportar.",
    changes: "Alterações",
    changesBody: "Os termos podem mudar à medida que a Noven evolui. Continuar a usar a app significa aceitar a versão mais recente.",
  },
});
Object.assign(resources["pt-PT"].translation.prompt, {
  title: "Prompt",
  heading: "Exportar um prompt.",
  markdownTitle: "Prompt de dados pessoais Noven",
  range: "PERIODO",
  share: "Partilhar / Copiar",
  unlock: "Desbloquear exportacao",
  premiumTitle: "Funcao Premium",
  premiumBody: "Desbloqueie a exportacao de prompt para transformar o historico local de habitos num prompt de coaching util.",
  last7: "7 dias",
  last30: "30 dias",
  last90: "90 dias",
  all: "Tudo",
  subtitle: "{{count}} reflexao incluida de {{range}}.",
  subtitle_plural: "{{count}} reflexoes incluidas de {{range}}.",
  noReflections: "Ainda nao ha reflexoes neste periodo.",
});
resources["pt-BR"].translation = clone(resources["pt-PT"].translation);
Object.assign(resources["pt-BR"].translation.common, { reset: "Redefinir" });
Object.assign(resources["pt-BR"].translation.settings, { title: "Configurações" });
Object.assign(resources["pt-BR"].translation.settings.language, { row: "Idioma", system: "Sistema / idioma do celular" });
Object.assign(resources["pt-BR"].translation.prompt, {
  heading: "Exportar um prompt.",
  share: "Compartilhar / Copiar",
  unlock: "Desbloquear exportacao",
  premiumTitle: "Recurso Premium",
  premiumBody: "Desbloqueie a exportacao de prompt para transformar seu historico local de habitos em um prompt de coaching util.",
  subtitle: "{{count}} reflexao incluida de {{range}}.",
  subtitle_plural: "{{count}} reflexoes incluidas de {{range}}.",
});
Object.assign(resources["pt-BR"].translation.patterns, {
  analytics: "ANÁLISE",
  title: "Padrões",
  days: "{{count}} dia",
  days_plural: "{{count}} dias",
  less: "Menos",
  more: "Mais",
});
Object.assign(resources["pt-BR"].translation.legal, {
  privacyHeading: "Seus dados ficam no dispositivo.",
  privacySubtitle: "O Noven funciona primeiro localmente para hábitos e reflexões. As compras Premium são processadas pela Apple e pela Adapty.",
  termsHeading: "Termos simples para um app local.",
  termsSubtitle: "Use o Noven como uma ferramenta pessoal de hábitos. Você escolhe o que compartilhar.",
  sections: {
    ...resources["pt-BR"].translation.legal.sections,
    localDataBody: "Seus hábitos, perfil, registros e reflexões são salvos localmente neste dispositivo.",
    purchasesBody: "O status Premium é processado pela Apple e pela Adapty. O Noven não salva dados de cartões de pagamento.",
    exportsBody: "Se você exportar um prompt ou compartilhar texto, você escolhe o que sai do dispositivo.",
    personalUseBody: "O Noven é uma ferramenta autoguiada de hábitos, não aconselhamento médico, financeiro ou profissional.",
    responsibility: "Sua responsabilidade",
    responsibilityBody: "Você é responsável pelo texto que insere e escolhe exportar.",
    changesBody: "Os termos podem mudar à medida que o Noven evolui. Continuar usando o app significa aceitar a versão mais recente.",
  },
});

export function getDeviceLocale(): AppLocale {
  const locales = Localization.getLocales();
  return resolveLocale(locales[0]?.languageTag);
}

export function resolveLocale(preferredLocale?: string | null): AppLocale {
  if (!preferredLocale || preferredLocale === "system") {
    preferredLocale = Localization.getLocales()[0]?.languageTag;
  }

  if (!preferredLocale) return defaultLocale;
  const normalized = preferredLocale.replace("_", "-");
  if (supportedLocales.includes(normalized as AppLocale)) return normalized as AppLocale;

  const language = normalized.split("-")[0];
  if (language === "en") return normalized.toLowerCase().includes("gb") ? "en-GB" : "en-US";
  if (language === "ja") return "ja-JP";
  if (language === "fr") return normalized.toLowerCase().includes("ch") ? "fr-CH" : "fr-FR";
  if (language === "it") return "it-IT";
  if (language === "pt") return normalized.toLowerCase().includes("br") ? "pt-BR" : "pt-PT";
  return defaultLocale;
}

export async function initializeLocalization(preferredLocale?: SupportedLocale) {
  const locale = resolveLocale(preferredLocale);
  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      compatibilityJSON: "v4",
      fallbackLng: defaultLocale,
      interpolation: { escapeValue: false },
      lng: locale,
      resources,
      returnNull: false,
    });
    return locale;
  }

  await i18n.changeLanguage(locale);
  return locale;
}

export async function setAppLocale(locale: SupportedLocale) {
  return initializeLocalization(locale);
}

export function currentLocale() {
  return resolveLocale(i18n.language);
}

export function translate(key: string, options?: Record<string, unknown>) {
  return i18n.t(key, options);
}

const storedFocusKeys: Record<string, string> = {
  "better focus": "focusOptions.betterFocus",
  consistency: "focusOptions.consistency",
  "mental clarity": "focusOptions.mentalClarity",
  "routine building": "focusOptions.routineBuilding",
  "energy balance": "focusOptions.energyBalance",
  "deep work": "focusOptions.deepWork",
};

export function localizeStoredFocus(value?: string, translateFn: (key: string) => string = translate) {
  if (!value) {
    return "";
  }

  const key = storedFocusKeys[value.trim().toLowerCase()];
  return key ? translateFn(key) : value;
}

export function formatTime(value: Date) {
  return new Intl.DateTimeFormat(currentLocale(), { hour: "2-digit", minute: "2-digit" }).format(value);
}

export function formatDate(value: Date | string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(currentLocale(), options).format(new Date(value));
}

export function useAppLocale() {
  const { i18n: instance, t } = useTranslation();
  return useMemo(
    () => ({
      locale: resolveLocale(instance.language),
      t,
    }),
    [instance.language, t],
  );
}

export { i18n };
