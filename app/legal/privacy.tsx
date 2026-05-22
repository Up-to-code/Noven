import { View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenIntro } from "@/components/ui/ScreenIntro";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";

const sections = [
  {
    title: "Local storage",
    body: "Noven saves your name, MBTI type, focus, habits, completions, reflections, and reminder preferences on this device.",
  },
  {
    title: "Subscription service",
    body: "If you view or buy Premium, Noven uses Adapty and Apple's purchase system to load products, process purchases, restore access, and read subscription status. Habit and reflection content is not sent to Adapty.",
  },
  {
    title: "Prompt export",
    body: "If you export a prompt, iOS opens the share sheet. You choose where that text goes. Any app you share to has its own privacy rules.",
  },
  {
    title: "Notifications",
    body: "Habit reminders are optional local notifications. They are off by default and can be turned off in Noven or iOS Settings.",
  },
  {
    title: "No tracking",
    body: "Noven does not include ads, social tracking, cloud habit sync, or server-side AI processing.",
  },
];

export default function PrivacyScreen() {
  return (
    <Screen contentStyle={{ gap: spacing.sectionGap }}>
      <ScreenHeader title="Privacy" showBack />
      <ScreenIntro
        title="Your data stays on your device."
        subtitle="Noven is local-first for habits and reflections. Premium purchases are handled by Apple and Adapty."
        variant="heading"
      />

      <View style={{ gap: spacing.componentGap }}>
        {sections.map((section) => (
          <View key={section.title} style={{ gap: spacing.smallGap }}>
            <Text variant="caption">{section.title.toUpperCase()}</Text>
            <Text color="muted" variant="body">
              {section.body}
            </Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
