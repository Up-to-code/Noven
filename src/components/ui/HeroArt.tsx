import { View, type ViewProps } from "react-native";

import { Illustration, type IllustrationAsset } from "@/components/ui/Illustration";

type HeroArtProps = ViewProps & {
  asset: IllustrationAsset;
  opacity?: number;
};

export function HeroArt({ asset, opacity = 0.58, style, ...props }: HeroArtProps) {
  return (
    <View
      {...props}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
        },
        style,
      ]}
    >
      <Illustration asset={asset} mode="full" opacity={opacity} style={{ height: "100%" }} />
    </View>
  );
}
