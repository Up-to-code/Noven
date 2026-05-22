import { ActivityIndicator } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { spacing } from "@/design/spacing";

export default function LoadingScreen() {
  return (
    <Screen contentStyle={{ alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator color={colors.foreground} />
      <Text variant="small" color="muted" style={{ marginTop: spacing.componentGap }}>
        Building your system...
      </Text>
    </Screen>
  );
}
