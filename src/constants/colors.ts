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

import { Palette } from "./palette";

export const OldPalette = {
  // Brand
  primary: "#001A88",
  secondary: "#059ED8",
  tertiary: "#FFFFFF",
  dark: "#09203B",
  darkVariant: "#112C4B",

  white: "#FFFFFF",

  // Slate
  slate900: "#0F172A", // dark bg
  slate800: "#1E293B", // dark surface
  slate700: "#334155", // dark surface variant / dark border / light text primary
  slate600: "#475569", // light text secondary / dark disabled
  slate500: "#64748b",
  slate400: "#94A3B8", // dark text secondary / light disabled
  slate200: "#E2E8F0", // light border
  slate100: "#F1F5F9", // light surface variant
  slate50: "#F8FAFC", // light bg / dark text primary

  // Red
  red100: "#fee2e2",
  red200: "#fecaca",
  red300: "#fca5a5",
  red400: "#F87171", // error light
  red500: "#EF4444", // error default
  red600: "#DC2626", // error dark

  // Green
  green100: "#dcfce7",
  green200: "#bbf7d0",
  green300: "#86efac",
  green400: "#4ade80",
  green500: "#22c55e",
  green600: "#16a34a",

  // Blue
  blue100: "#dbeafe",
  blue200: "#bfdbfe",
  blue300: "#93c5fd",
  blue400: "#60a5fa",
  blue500: "#3b82f6",
  blue600: "#2563eb",

  //amber
  amber100: "#fef3c7",
  amber200: "#fde68a",
  amber300: "#fcd34d",
  amber400: "#fbbf24",
  amber500: "#f59e0b",
  amber600: "#ca8a04",
} as const;

export const LightColors = {
  // Brand
  primary: Palette.mbBlue500,
  secondary: Palette.mbBlue500,
  tertiary: Palette.mbAzure500,

  // Shadow
  shadowTintedLow: Palette.mbAzureAlpha10,

  // Brand gradient (active tab icons, gradient rings): purple -> blue
  brandGradientStart: Palette.mbHelio500,
  brandGradientEnd: Palette.mbAzure500,

  // Stepper
  stepperCompletedBg: Palette.mbBlue500,
  stepperIncompleteBg: Palette.mbGrey200,
  stepperIconColor: Palette.white100,
  stepperConnectorColor: Palette.mbGrey300,

  // Status
  statusPending: Palette.sysYellow600,
  statusSuccess: Palette.sysGreen600,
  statusFailed: Palette.sysRed600,
  statusIconForeground: Palette.white100,

  success: Palette.sysGreen500,
  error: Palette.sysRed500,
  errorLight: OldPalette.red400,
  errorDark: OldPalette.red600,
  warning: "#F59E0B",
  info: OldPalette.secondary,

  // Backgrounds
  backgroundGradientStart: Palette.mbGrey050,
  backgroundGradientEnd: Palette.sysSkyBlue400,
  background: Palette.mbGrey050,
  backgroundVariant: OldPalette.tertiary,
  surface: OldPalette.tertiary,
  surfaceVariant: OldPalette.slate100,
  surfaceElevated: OldPalette.tertiary,

  // Text
  textBrandPrimary: Palette.mbBlue500,

  textPrimary: Palette.mbGrey800,
  textSecondary: Palette.mbGrey500,
  textTertiary: Palette.mbGrey400,
  textDisabled: OldPalette.slate400,
  textInverse: OldPalette.white,
  textLink: OldPalette.secondary,
  textHeader: OldPalette.primary,
  textSubHeader: OldPalette.secondary,
  textError: Palette.sysRed600,
  textSuccess: Palette.sysGreen500,

  // Icon
  iconBrandPrimary: Palette.mbBlue500,
  iconBrandSecondary: Palette.mbAzure600,
  iconPrimary: OldPalette.slate900,
  iconSecondary: Palette.mbGrey500,
  iconTertiary: Palette.mbGrey400,
  iconError: Palette.sysRed600,
  iconSuccess: Palette.sysGreen400,

  // Borders
  borderDefault: Palette.mbGrey200,
  borderSubtle: Palette.mbGrey050,
  borderSuccess: Palette.sysGreen600,
  borderError: Palette.sysRed600,

  // Dividers
  dividerDefault: Palette.black010,

  // Fill
  fillError: Palette.mbUltra050,

  // Forms/Inputs
  inputBackground: Palette.white100,
  inputBorder: OldPalette.slate400,
  inputPlaceholder: OldPalette.slate400,
  inputBorderError: Palette.sysRed600,
  inputBorderFocused: Palette.mbBlue500,
  inputBackgroundError: Palette.white100,
  inputPlaceholderError: Palette.sysRed600,
  inputBackgroundDisabled: Palette.mbGrey050,

  // Buttons
  buttonPrimary: Palette.mbBlue500,
  buttonDisabledBackground: Palette.mbGrey050,
  buttonDisabledText: Palette.mbGrey200,

  // Toast
  toastSuccessBg: Palette.mbGreen100,
  toastSuccessIcon: Palette.mbGreen600,
  toastErrorBg: Palette.sysRed100,
  toastErrorIcon: Palette.sysRed600,
  toastInfoBg: Palette.mbAzure100,
  toastInfoIcon: Palette.mbAzure600,
  toastWarningBg: Palette.mbYellow100,
  toastWarningIcon: Palette.mbYellow600,

  // Selection List
  listItemSelectedBg: Palette.sysSkyBlue500,
  listSectionHeaderBg: Palette.mbGrey050,

  // Overlay
  overlay: "rgba(15, 23, 42, 0.5)",
} as const;

export const DarkColors = {
  // Brand
  primary: Palette.mbBlue500,
  secondary: Palette.mbBlue500,
  tertiary: Palette.mbAzure500,

  // Shadow
  shadowTintedLow: Palette.mbAzureAlpha10,

  // Brand gradient (active tab icons, gradient rings): purple -> blue
  brandGradientStart: Palette.mbHelio500,
  brandGradientEnd: Palette.mbAzure500,

  // Stepper
  stepperCompletedBg: Palette.mbBlue500,
  stepperIncompleteBg: Palette.mbGrey200,
  stepperIconColor: Palette.white100,
  stepperConnectorColor: Palette.mbGrey300,

  // Status
  statusPending: Palette.sysYellow600,
  statusSuccess: Palette.sysGreen600,
  statusFailed: Palette.sysRed600,
  statusIconForeground: Palette.white100,

  success: Palette.sysGreen500,
  error: Palette.sysRed500,
  errorLight: OldPalette.red400,
  errorDark: OldPalette.red600,
  warning: "#F59E0B",
  info: OldPalette.secondary,

  // Backgrounds
  backgroundGradientStart: Palette.mbGrey050,
  backgroundGradientEnd: Palette.sysSkyBlue400,
  background: Palette.mbGrey050,
  backgroundVariant: OldPalette.tertiary,
  surface: OldPalette.tertiary,
  surfaceVariant: OldPalette.slate100,
  surfaceElevated: OldPalette.tertiary,

  // Text
  textBrandPrimary: Palette.mbBlue500,

  textPrimary: Palette.mbGrey800,
  textSecondary: Palette.mbGrey500,
  textTertiary: Palette.mbGrey400,
  textDisabled: OldPalette.slate400,
  textInverse: OldPalette.white,
  textLink: OldPalette.secondary,
  textHeader: OldPalette.primary,
  textSubHeader: OldPalette.secondary,
  textError: Palette.sysRed600,
  textSuccess: Palette.sysGreen500,

  // Icon
  iconBrandPrimary: Palette.mbBlue500,
  iconBrandSecondary: Palette.mbAzure500,
  iconPrimary: OldPalette.slate900,
  iconSecondary: Palette.mbGrey500,
  iconTertiary: Palette.mbGrey400,
  iconError: Palette.sysRed600,
  iconSuccess: Palette.sysGreen500,

  // Borders
  borderDefault: Palette.mbGrey200,
  borderSubtle: Palette.mbGrey050,
  borderSuccess: Palette.sysGreen600,
  borderError: Palette.sysRed600,

  // Dividers
  dividerDefault: Palette.black010,

  // Fill
  fillError: Palette.mbUltra050,

  // Forms/Inputs
  inputBackground: Palette.white100,
  inputBorder: OldPalette.slate400,
  inputBorderError: Palette.sysRed600,
  inputBorderFocused: OldPalette.secondary,
  inputPlaceholder: OldPalette.slate400,
  inputBackgroundError: Palette.sysRed050,
  inputPlaceholderError: Palette.sysRed400,
  inputBackgroundDisabled: Palette.mbGrey050,

  // Buttons
  buttonPrimary: Palette.mbBlue500,
  buttonDisabledBackground: Palette.mbGrey050,
  buttonDisabledText: Palette.mbGrey200,

  // Toast
  toastSuccessBg: Palette.mbGreen100,
  toastSuccessIcon: Palette.mbGreen600,
  toastErrorBg: Palette.sysRed100,
  toastErrorIcon: Palette.sysRed600,
  toastInfoBg: Palette.mbAzure100,
  toastInfoIcon: Palette.mbAzure600,
  toastWarningBg: Palette.mbYellow100,
  toastWarningIcon: Palette.mbYellow600,

  // Selection List
  listItemSelectedBg: Palette.mbAzure050,
  listSectionHeaderBg: Palette.mbGrey050,

  // Overlay
  overlay: "rgba(15, 23, 42, 0.5)",
} as const satisfies AppColors;

export type AppColors = Readonly<Record<keyof typeof LightColors, string>>;
