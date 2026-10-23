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
import {
  BRAND_ICON_PATHS,
  BrandIconDefinition,
  BrandIconGrid,
  BrandIconName,
  ICON_GRID_SIZES,
  ICON_GRIDS,
} from "./brandIconPaths";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useId } from "react";
import { resolveIconGrid } from "../../utils/ui/iconGrid";

const DEFAULT_SIZE = 24;

export type BrandIconGradient = Readonly<{ from: string; to: string }>;

export type BrandIconProps<N extends BrandIconName> = Readonly<{
  name: N;
  // Which drawing to use: "S" (16 grid), "M" (24) or "L" (96); only the
  // ones this icon has. Default: "S", or the icon's only drawing
  grid?: BrandIconGrid<N>;
  // Shown size in points (independent of the grid)
  size?: number;
  color?: string;
  gradient?: boolean | BrandIconGradient;
}>;

export function BrandIcon<N extends BrandIconName>({
  name,
  grid,
  size = DEFAULT_SIZE,
  color,
  gradient,
}: BrandIconProps<N>) {
  const { colors } = useAppTheme();

  // The drawing for the chosen grid; its viewBox is the grid's size
  const drawings: BrandIconDefinition = BRAND_ICON_PATHS[name];
  const chosenGrid = resolveIconGrid(
    ICON_GRIDS.filter((item) => drawings[item] !== undefined),
    grid,
  );
  const paths = drawings[chosenGrid] ?? [];
  const gridSize = ICON_GRID_SIZES[chosenGrid];

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
    <Svg
      width={size}
      height={size}
      viewBox={`0 0 ${gridSize} ${gridSize}`}
      fill="none"
    >
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
