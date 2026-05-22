import { View } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { ScreenIntro } from "@/components/ui/ScreenIntro";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";

const sections = [
  {
    title: "Use",
    body: "Noven helps you organize habits, reflections, reminders, and personal focus patterns. It is not medical, clinical, or mental health advice.",
  },
  {
    title: "Your responsibility",
    body: "You choose what to enter, what reminders to enable, and where exported prompt text is shared.",
  },
  {
    title: "Local data",
    body: "Data is stored on your device. Reset Local Data removes the app profile, habits, logs, and reflections from Noven's local storage.",
  },
  {
    title: "Premium",
    body: "Noven Premium is an optional auto-renewable subscription billed by Apple. Manage or cancel it from your Apple ID subscription settings.",
  },
  {
    title: "No account",
    body: "This build has no sign-in, cloud backup, ads, or social features. Core habit creation remains available without Premium.",
  },
];

export default function TermsScreen() {
  return (
    <Screen contentStyle={{ gap: spacing.sectionGap }}>
      <ScreenHeader title="Terms" showBack />
      <ScreenIntro
        title="Simple terms for a local app."
        subtitle="Use Noven as a personal habit tool. Keep anything sensitive out of exported text unless you choose to share it."
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
