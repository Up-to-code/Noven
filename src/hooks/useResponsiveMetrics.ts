import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

type ResponsiveMetricsOptions = {
  horizontalPadding?: number;
};

export function useResponsiveMetrics(options: ResponsiveMetricsOptions = {}) {
  const { height, width } = useWindowDimensions();
  const horizontalPadding = options.horizontalPadding ?? 24;

  return useMemo(() => {
    const usableWidth = Math.max(width - horizontalPadding * 2, 0);
    const isCompact = width < 380 || height < 720;
    const isRoomy = width >= 430 && height >= 840;

    return {
      height,
      horizontalPadding,
      isCompact,
      isRoomy,
      usableWidth,
      width,
      clamp,
      scaleWidth: (ratio: number, min: number, max: number) => clamp(width * ratio, min, max),
      scaleHeight: (ratio: number, min: number, max: number) => clamp(height * ratio, min, max),
    };
  }, [height, horizontalPadding, width]);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
