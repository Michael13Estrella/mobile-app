/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-02
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { LightColors, DarkColors } from "../constants/colors";
import { Typography } from "../constants/typography";

const sharedFonts = {
  bodyLarge: {
    ...MD3LightTheme.fonts.bodyLarge,
    fontSize: Typography.sizes.md,
  },
  bodyMedium: {
    ...MD3LightTheme.fonts.bodyMedium,
    fontSize: Typography.sizes.sm,
  },
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: LightColors.primary,
    primaryContainer: LightColors.surfaceVariant,
    secondary: LightColors.secondary,
    secondaryContainer: LightColors.surfaceVariant,
    background: LightColors.background,
    surface: LightColors.surface,
    surfaceVariant: LightColors.surfaceVariant,
    error: LightColors.error,
    onPrimary: LightColors.textInverse,
    onSecondary: LightColors.textInverse,
    onBackground: LightColors.textPrimary,
    onSurface: LightColors.textPrimary,
    outline: LightColors.borderDefault,
  },
  fonts: {
    ...MD3LightTheme.fonts,
    ...sharedFonts,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: DarkColors.primary,
    primaryContainer: DarkColors.primary,
    secondary: DarkColors.secondary,
    secondaryContainer: DarkColors.secondary,
    background: DarkColors.background,
    surface: DarkColors.surface,
    surfaceVariant: DarkColors.surfaceVariant,
    error: DarkColors.error,
    onPrimary: DarkColors.textInverse,
    onSecondary: DarkColors.textInverse,
    onBackground: DarkColors.textPrimary,
    onSurface: DarkColors.textPrimary,
    outline: DarkColors.borderDefault,
  },
  fonts: {
    ...MD3DarkTheme.fonts,
    ...sharedFonts,
  },
};

export type AppTheme = typeof lightTheme;
