const FONT_BRAND_REGULAR = "MetrobankSans-Regular";
const FONT_BRAND_BOLD = "MetrobankSans-Bold";
const FONT_GLOBAL_REGULAR = "NotoSans-Regular";

export const BRAND_WEIGHT_FONTS_EN = {
  light: "MetrobankSans-Light",
  regular: "MetrobankSans-Regular",
  bold: "MetrobankSans-Bold",
} as const;

export const BRAND_ITALIC_FONTS_EN = {
  light: "MetrobankSans-LightItalic",
  regular: "MetrobankSans-Italic",
  bold: "MetrobankSans-BoldItalic",
} as const;

export const GLOBAL_ITALIC_FONTS_EN = {
  regular: "NotoSans-Italic",
  bold: "NotoSans-BoldItalic",
};

export const GLOBAL_WEIGHT_FONTS_EN = {
  thin: "NotoSans-Thin",
  extraLight: "NotoSans-ExtraLight",
  light: "NotoSans-Light",
  regular: "NotoSans-Regular",
  medium: "NotoSans-Medium",
  semibold: "NotoSans-SemiBold",
  bold: "NotoSans-Bold",
  extrabold: "NotoSans-ExtraBold",
  black: "NotoSans-Black",
} as const;

// Every Japanese character renders through this map, for BOTH brand and
// global tokens — Metrobank Sans has no CJK glyphs, so there is no
// brand-typeface option in Japanese at all.
export const GLOBAL_WEIGHT_FONTS_JA = {
  thin: "NotoSansJP-Thin",
  extraLight: "NotoSansJP-ExtraLight",
  light: "NotoSansJP-Light",
  regular: "NotoSansJP-Regular",
  medium: "NotoSansJP-Medium",
  semibold: "NotoSansJP-SemiBold",
  bold: "NotoSansJP-Bold",
  extrabold: "NotoSansJP-ExtraBold",
  black: "NotoSansJP-Black",
} as const;

export type BrandWeight = keyof typeof BRAND_WEIGHT_FONTS_EN;
export type GlobalWeight = keyof typeof GLOBAL_WEIGHT_FONTS_JA;

export const TypographyTokens = {
  h1: {
    fontFamily: FONT_BRAND_BOLD,
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: -0.75,
  },
  h2: {
    fontFamily: FONT_BRAND_BOLD,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  h3: {
    fontFamily: FONT_BRAND_BOLD,
    fontSize: 24,
    lineHeight: 26,
    letterSpacing: -0.5,
  },
  h4: {
    fontFamily: FONT_BRAND_BOLD,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: -0.25,
  },
  h5: {
    fontFamily: FONT_BRAND_BOLD,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.5,
  },
  display: {
    fontFamily: FONT_GLOBAL_REGULAR,
    fontSize: 24,
    lineHeight: 26,
    letterSpacing: -0.5,
  },
  button1: {
    fontFamily: FONT_BRAND_REGULAR,
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
  },
  button2: {
    fontFamily: FONT_BRAND_REGULAR,
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0,
  },
  button3: {
    fontFamily: FONT_BRAND_REGULAR,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0,
  },
  title1: {
    fontFamily: FONT_BRAND_REGULAR,
    fontSize: 16,
    lineHeight: 23,
    letterSpacing: 0,
  },
  title2: {
    fontFamily: FONT_BRAND_REGULAR,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  title3: {
    fontFamily: FONT_BRAND_REGULAR,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0,
  },
  title4: {
    fontFamily: FONT_BRAND_REGULAR,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0,
  },
  overline1: {
    fontFamily: FONT_BRAND_REGULAR,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0.85,
  },
  overline2: {
    fontFamily: FONT_BRAND_REGULAR,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.85,
  },
  label1: {
    fontFamily: FONT_GLOBAL_REGULAR,
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0,
  },
  label2: {
    fontFamily: FONT_GLOBAL_REGULAR,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: 0,
  },
  body1: {
    fontFamily: FONT_GLOBAL_REGULAR,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
  },
  body2: {
    fontFamily: FONT_GLOBAL_REGULAR,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0,
  },
  body3: {
    fontFamily: FONT_GLOBAL_REGULAR,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  body4: {
    fontFamily: FONT_GLOBAL_REGULAR,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0,
  },
} as const;

export const Typography = {
  fonts: {
    regular: "System",
    medium: "System",
    bold: "System",
  },
  sizes: {
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 38,
  },
  weights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;
