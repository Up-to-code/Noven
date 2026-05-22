import type { ComponentProps } from "react";
import {
  TextInput as RNTextInput,
  View,
  type StyleProp,
  type TextInput,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { typography } from "@/design/typography";

type InputProps = Omit<ComponentProps<typeof TextInput>, "style"> & {
  error?: string;
  style?: StyleProp<ViewStyle>;
};

export function Input({ error, placeholderTextColor = colors.softText, style, ...props }: InputProps) {
  return (
    <View style={style}>
      <RNTextInput
        {...props}
        placeholderTextColor={placeholderTextColor}
        style={[
          {
            minHeight: spacing.touch,
            height: spacing.touch,
            borderRadius: radius.input,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: error ? colors.danger : colors.border,
            backgroundColor: colors.background,
            color: colors.foreground,
            paddingHorizontal: spacing.componentGap,
            paddingTop: 0,
            paddingBottom: 0,
            paddingVertical: 0,
            textAlignVertical: "center",
            includeFontPadding: false,
          },
          {
            ...(typography.body as TextStyle),
            lineHeight: 22,
          },
        ]}
      />
      {error ? (
        <Text color="danger" variant="small" style={{ marginTop: spacing.smallGap }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
