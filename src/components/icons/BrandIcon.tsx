/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-04
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { BRAND_ICON_PATHS, BrandIconName } from "./brandIconPaths";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useId } from "react";

const DEFAULT_SIZE = 24;

export type BrandIconGradient = Readonly<{ from: string; to: string }>;

export type BrandIconProps = Readonly<{
  name: BrandIconName;
  size?: number;
  color?: string;
  gradient?: boolean | BrandIconGradient;
}>;

export function BrandIcon({
  name,
  size = DEFAULT_SIZE,
  color,
  gradient,
}: BrandIconProps) {
  const { colors } = useAppTheme();
  const { viewBox, paths } = BRAND_ICON_PATHS[name];
  // Unique per icon instance, so several gradient icons can share a screen.
  // (useId contains ":" characters, which aren't valid in an SVG reference)
  const gradientId = `brandIconGradient${useId().replaceAll(":", "")}`;

  // `gradient` (true) -> the brand gradient from the theme.
  const gradientColors: BrandIconGradient | null =
    gradient === true
      ? { from: colors.brandGradientStart, to: colors.brandGradientEnd }
      : gradient || null;

  const fill = gradientColors
    ? `url(#${gradientId})`
    : (color ?? colors.primary);

  return (
    <Svg width={size} height={size} viewBox={viewBox} fill="none">
      {gradientColors && (
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={gradientColors.from} />
            <Stop offset="1" stopColor={gradientColors.to} />
          </LinearGradient>
        </Defs>
      )}
      {paths.map((d, index) => (
        <Path
          key={index}
          fillRule="evenodd"
          clipRule="evenodd"
          d={d}
          fill={fill}
        />
      ))}
    </Svg>
  );
}
