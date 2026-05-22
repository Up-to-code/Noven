# NOVEN — Technical Setup & Architecture Brief

## Goal

Build NOVEN as a premium, minimal, monochrome React Native app for personality-based habit tracking.

The app must use reusable React Native components, design-system tokens, Zustand for app state, and SQLite for local app data. It must not invent a custom UI framework or rely on one-off screen-level styling.

## Product Direction

NOVEN should feel like a calm psychological operating system: minimal, premium, spacious, monochrome, and editorial. The interface should emphasize clarity, reflection, and intentional habit design rather than colorful dashboard patterns or gamified habit mechanics.

The app should avoid:

- Colorful dashboard UI
- Childish illustrations
- Heavy cards
- Noisy gradients
- Too many buttons
- Random visual styles outside the design system

## Core Stack

- React Native
- Expo
- TypeScript
- Zustand
- Expo SQLite
- Expo Router preferred; React Navigation acceptable if implementation requires it
- React Hook Form
- Zod
- Lucide React Native
- React Native SVG
- Moti
- Victory Native
- date-fns

## Install Commands

```bash
npx create-expo-app noven --template
cd noven
npx expo install react-native-safe-area-context react-native-screens react-native-gesture-handler react-native-reanimated react-native-svg expo-linear-gradient expo-blur expo-font expo-secure-store expo-notifications expo-haptics expo-image
npm install zustand react-hook-form zod @hookform/resolvers @react-native-async-storage/async-storage lucide-react-native moti victory-native date-fns
npx expo install expo-sqlite
```

## App Architecture

```text
src/
  app/
    navigation/
    screens/
      onboarding/
      home/
      habits/
      patterns/
      profile/
      settings/
    components/
      ui/
      cards/
      forms/
      navigation/
    design/
      tokens.ts
      colors.ts
      spacing.ts
      typography.ts
      radius.ts
    store/
      userStore.ts
      habitStore.ts
      onboardingStore.ts
      preferenceStore.ts
    services/
      database.ts
    types/
      user.ts
      habit.ts
      reflection.ts
    assets/
      illustrations/
      icons/
```

Use `src/design/` as the only source for colors, spacing, typography, radius, and shared component sizing. Screens should compose reusable components and tokens rather than define their own visual system.

## State Management

Use Zustand for global app state. Do not use Redux.

Zustand stores should cover:

- Onboarding state
- User profile
- Selected MBTI type
- Selected focus goal
- Habits
- Reflections
- App preferences

Keep stores focused by domain. Avoid turning a single store into a catch-all app container.

## SQLite Architecture

Use Expo SQLite for local-first app data:

- User profile
- Selected MBTI type
- Selected focus goal
- Habits
- Reflections
- App preferences
- Prompt export data

SQLite tables:

- `user_profile`
- `habits`
- `reflections`
- `settings`
- `preferences`

Do not add Firebase, Apple sign-in, Google sign-in, OpenRouter, or Apple Intelligence to this build. The prompt screen exports markdown based on local data so the user can paste it into any LLM outside NOVEN.

## Forms And Validation

Use React Hook Form with Zod validation for all structured input.

Forms include:

- Name input
- MBTI selection
- Focus selection
- Create habit
- Edit habit
- Daily reflection

Validation rules should live near the form or in a small shared validation module when reused. Form UI should be built from reusable input, chip, button, and screen components.

## Design System Rules

All UI must follow the NOVEN design system.

Do not hardcode these values inside screens:

- Colors
- Spacing
- Radius
- Typography
- Button sizes

Use token files instead:

```ts
colors.background;
spacing.screenHorizontal;
radius.button;
typography.display;
```

Initial token files:

- `src/design/colors.ts`
- `src/design/spacing.ts`
- `src/design/typography.ts`
- `src/design/radius.ts`
- `src/design/tokens.ts`

The provided design language uses:

- White background: `#FFFFFF`
- Near-black foreground: `#0D0D0F`
- Muted text: `#6F6F73`
- Soft text: `#9A9AA1`
- Border: `#ECECEF`
- Surface: `#F7F7F8`
- Editorial display typography with Playfair Display
- Functional body typography with Inter

## UI Components

Build with reusable React Native components. Do not build a custom UI library from scratch.

First components to create:

- `Button`
- `Text`
- `Screen`
- `Input`
- `Card`
- `Chip`
- `ProgressBar`
- `BottomNav`
- `HabitRow`
- `SectionHeader`
- `Illustration`

Use Lucide React Native for icons. Use React Native SVG for vector illustrations and charts. Use Moti for subtle motion. Use Victory Native for charting in pattern views.

## Screens

The first implementation should cover:

- Welcome
- Name input
- MBTI selection
- Focus selection
- About NOVEN
- Future system
- Home
- Habit discovery
- Create habit
- Setup complete
- Habit detail
- Daily reflection
- Patterns
- Adjust habit
- Milestone
- Profile
- Settings
- Empty state
- Loading
- Error states

## First Implementation Order

1. Create the Expo project.
2. Install required libraries.
3. Configure TypeScript.
4. Create design token files.
5. Create base UI components.
6. Set up navigation.
7. Set up Zustand stores.
8. Set up SQLite.
9. Build onboarding screens.
10. Build the home screen.
11. Build habit lifecycle screens.
12. Build patterns, profile, and settings screens.
13. Add prompt export.
14. Add loading, empty, and error states.

## Builder Rules

- Use existing React Native libraries and reusable components.
- Do not invent a new UI framework.
- Do not create random visual styles.
- Keep all UI driven by the design system.
- Do not use Redux.
- Do not add fake AI, network auth, or provider-dependent flows.
- Do not hardcode visual values in screens.
- Do not use colorful, gamified, or noisy interface patterns.
- Prefer Expo Router because Expo is part of the chosen stack.
- Keep SQLite service code isolated in `src/services/`.
- Keep reusable app types in `src/types/`.

## Acceptance Criteria

- The NOVEN project can be scaffolded from the install commands above.
- The architecture defines where screens, components, design tokens, stores, services, types, and assets belong.
- Zustand is the documented global state solution.
- Expo SQLite is the documented local data layer.
- React Hook Form and Zod are the documented form tools.
- The design-system token rule is explicit and applies to every screen.
- The first implementation order is clear from project creation through habit lifecycle screens.
