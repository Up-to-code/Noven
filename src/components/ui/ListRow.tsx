import type { ComponentType } from "react";
import { Pressable, View, type PressableProps } from "react-native";
import { ChevronRight, type LucideProps } from "lucide-react-native";

import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { spacing } from "@/design/spacing";

type ListRowProps = Omit<PressableProps, "style"> & {
  destructive?: boolean;
  icon?: ComponentType<LucideProps>;
  label: string;
  showChevron?: boolean;
};

export function ListRow({ destructive = false, icon: Icon, label, showChevron = true, ...props }: ListRowProps) {
  const tint = destructive ? colors.danger : colors.foreground;

  return (
    <Pressable
      {...props}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        minHeight: 58,
        paddingHorizontal: spacing.componentGap,
        backgroundColor: pressed ? colors.surface : colors.background,
      })}
    >
      {Icon ? <Icon size={20} color={tint} strokeWidth={1.5} /> : null}
      <Text variant="body" color={destructive ? "danger" : "default"} style={{ flex: 1, marginLeft: Icon ? spacing.componentGap : 0 }}>
        {label}
      </Text>
      {showChevron && !destructive ? <ChevronRight size={18} color={colors.softText} strokeWidth={1.5} /> : null}
    </Pressable>
  );
}
