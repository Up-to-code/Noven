import { Image, View, type ViewStyle } from "react-native";

import { getAvatarSource } from "@/content/avatars";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";

type AvatarImageProps = {
  id?: string;
  selected?: boolean;
  size?: number;
  style?: ViewStyle;
};

export function AvatarImage({ id, selected = false, size = 88, style }: AvatarImageProps) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radius.pill,
          borderWidth: selected ? 2 : 1,
          borderColor: selected ? colors.foreground : colors.border,
          backgroundColor: colors.background,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Image
        source={getAvatarSource(id)}
        resizeMode="cover"
        style={{
          width: size,
          height: size,
          borderRadius: radius.pill,
        }}
      />
    </View>
  );
}
