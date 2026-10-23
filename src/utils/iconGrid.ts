/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-23
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import {
  DEFAULT_ICON_GRID,
  IconGrid,
} from "../components/icons/brandIconPaths";

/**
 * Which drawing of an icon to use: the requested grid, otherwise the S
 * drawing, otherwise the icon's first one.
 *
 * @param available - The grids the icon is drawn at (at least one)
 * @param requested - The grid asked for, if any
 * @returns The grid to draw
 * @example resolveIconGrid(["M"], undefined); // "M"
 */
export const resolveIconGrid = (
  available: readonly IconGrid[],
  requested?: IconGrid,
): IconGrid => {
  if (requested !== undefined && available.includes(requested))
    return requested;

  if (available.includes(DEFAULT_ICON_GRID)) return DEFAULT_ICON_GRID;

  return available[0];
};
