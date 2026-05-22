import { Tabs } from "expo-router";
import { BarChart3, Home, Sprout, User, type LucideIcon } from "lucide-react-native";

import { colors } from "@/design/colors";
import { spacing } from "@/design/spacing";
import { typography } from "@/design/typography";

function tabIcon(Icon: LucideIcon) {
  return ({ color, size }: { color: string; size: number }) => (
    <Icon color={color} size={size} strokeWidth={1.8} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.foreground,
        tabBarInactiveTintColor: colors.softText,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 62 + spacing.smallGap,
          paddingTop: spacing.smallGap,
        },
        tabBarLabelStyle: {
          fontFamily: typography.caption.fontFamily,
          fontSize: typography.caption.fontSize,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: tabIcon(Home) }} />
      <Tabs.Screen name="habits" options={{ title: "Habits", tabBarIcon: tabIcon(Sprout) }} />
      <Tabs.Screen name="patterns" options={{ title: "Patterns", tabBarIcon: tabIcon(BarChart3) }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: tabIcon(User) }} />
    </Tabs>
  );
}
