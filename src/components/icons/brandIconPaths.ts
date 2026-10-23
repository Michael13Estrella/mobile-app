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

// Icons is shared from ABCMTG team
// https://www.figma.com/design/bxDCUEo4Fbe7OBZq1UPyZr/2.2.-MDS---Iconography

import { LINE_ICON_PATHS } from "./paths/linePaths";
import { SOLID_ICON_PATHS } from "./paths/solidPaths";

// The drawing sizes, smallest first: S, M and L are drawn on a 16, 24 and
// 96 grid (the Figma frame size)
export const ICON_GRIDS = ["S", "M", "L"] as const;
export type IconGrid = (typeof ICON_GRIDS)[number];

// The grid of each size; the drawing's viewBox is "0 0 {size} {size}"
export const ICON_GRID_SIZES: Readonly<Record<IconGrid, number>> = {
  S: 16,
  M: 24,
  L: 96,
};

// Used when no grid is given and the icon has an S drawing
export const DEFAULT_ICON_GRID: IconGrid = "S";

// One icon: its path list for each size it's drawn at
export type BrandIconDefinition = Readonly<
  Partial<Record<IconGrid, readonly string[]>>
>;

// Every icon by name; each style (…Line / …Solid) lives in its own file in
// paths/
export const BRAND_ICON_PATHS = {
  ...LINE_ICON_PATHS,
  ...SOLID_ICON_PATHS,
} as const satisfies Record<string, BrandIconDefinition>;

export type BrandIconName = keyof typeof BRAND_ICON_PATHS;

// The sizes a given icon is drawn at (e.g. "S" | "M" for an icon with both).
// For a name only known as BrandIconName (a prop), any size some icon has.
export type BrandIconGrid<N extends BrandIconName> = N extends BrandIconName
  ? keyof (typeof BRAND_ICON_PATHS)[N] & IconGrid
  : never;
