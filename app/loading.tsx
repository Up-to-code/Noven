import { ActivityIndicator } from "react-native";

import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { spacing } from "@/design/spacing";
import { useAppLocale } from "@/localization";

export default function LoadingScreen() {
  const { t } = useAppLocale();

  return (
    <Screen contentStyle={{ alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator color={colors.foreground} />
      <Text variant="small" color="muted" style={{ marginTop: spacing.componentGap }}>
        {t("loading.building")}
      </Text>
    </Screen>
  );
}
