import { Tabs } from "expo-router";
import { BarChart3, Home, Sprout, User, type LucideIcon } from "lucide-react-native";

import { colors } from "@/design/colors";
import { spacing } from "@/design/spacing";
import { typography } from "@/design/typography";
import { useAppLocale } from "@/localization";

function tabIcon(Icon: LucideIcon) {
  return ({ color, size }: { color: string; size: number }) => (
    <Icon color={color} size={size} strokeWidth={1.8} />
  );
}

export default function TabsLayout() {
  const { t } = useAppLocale();

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
      <Tabs.Screen name="index" options={{ title: t("tabs.home"), tabBarIcon: tabIcon(Home) }} />
      <Tabs.Screen name="habits" options={{ title: t("tabs.habits"), tabBarIcon: tabIcon(Sprout) }} />
      <Tabs.Screen name="patterns" options={{ title: t("tabs.patterns"), tabBarIcon: tabIcon(BarChart3) }} />
      <Tabs.Screen name="profile" options={{ title: t("tabs.profile"), tabBarIcon: tabIcon(User) }} />
    </Tabs>
  );
}
