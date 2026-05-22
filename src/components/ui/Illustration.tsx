import { Image, type ImageProps } from "expo-image";
import { StyleSheet, type ImageStyle, type StyleProp } from "react-native";

export const illustrationAssets = {
  welcome_reflection_wide: require("@/assets/illustrations/welcome-mindscape.png"),
  name_writing_clean: require("@/assets/illustrations/name-writing-desk.png"),
  standing_future_character: require("@/assets/illustrations/future-cliff-journey.png"),
} as const;

export type IllustrationAsset = keyof typeof illustrationAssets;

type IllustrationProps = Omit<ImageProps, "source" | "style"> & {
  asset: IllustrationAsset;
  bleed?: boolean;
  mode?: "ambient" | "full" | "icon";
  opacity?: number;
  style?: StyleProp<ImageStyle>;
  tintOpacity?: number;
};

const defaultOpacity = {
  ambient: 0.16,
  full: 0.78,
  icon: 1,
} as const;

export function Illustration({
  asset,
  bleed = false,
  contentFit,
  mode = "full",
  opacity,
  style,
  tintOpacity,
  ...props
}: IllustrationProps) {
  const fit = contentFit ?? "contain";
  const resolvedOpacity = opacity ?? tintOpacity ?? defaultOpacity[mode];

  return (
    <Image
      {...props}
      contentFit={fit}
      pointerEvents={mode === "ambient" ? "none" : props.pointerEvents}
      source={illustrationAssets[asset]}
      style={[
        styles.image,
        mode === "ambient" && styles.ambient,
        mode === "full" && styles.full,
        mode === "icon" && styles.icon,
        bleed && styles.bleed,
        { opacity: resolvedOpacity },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 280,
  },
  ambient: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: "100%",
    zIndex: 0,
  },
  bleed: {
    marginHorizontal: -28,
    width: "auto",
  },
  full: {
    height: 360,
  },
  icon: {
    height: 74,
  },
});
