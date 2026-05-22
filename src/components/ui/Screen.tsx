import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/design/colors";
import { spacing } from "@/design/spacing";

type ScreenProps = {
  children: ReactNode;
  contentStyle?: ViewStyle;
  padded?: boolean;
  scroll?: boolean;
  topPadding?: number;
};

function Section({ children, style, ...props }: ViewProps) {
  return (
    <View {...props} style={[{ gap: spacing.componentGap }, style]}>
      {children}
    </View>
  );
}

export function Screen({
  children,
  contentStyle,
  padded = true,
  scroll = true,
  topPadding = spacing.componentGap,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const contentContainerStyle = [
    {
      flexGrow: 1,
      gap: spacing.componentGap,
      paddingHorizontal: padded ? spacing.screenHorizontal : 0,
      paddingTop: insets.top + topPadding,
      paddingBottom: insets.bottom + spacing.componentGap,
    },
    contentStyle,
  ];

  if (!scroll) {
    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: colors.background,
          },
          ...contentContainerStyle,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={contentContainerStyle}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

Screen.Section = Section;
