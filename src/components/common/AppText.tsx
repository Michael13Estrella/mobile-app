/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-18
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Text, TextProps, TextStyle } from "react-native";
import { useAppSelector } from "../../store";
import {
  BRAND_ITALIC_FONTS_EN,
  BRAND_WEIGHT_FONTS_EN,
  BrandWeight,
  GLOBAL_ITALIC_FONTS_EN,
  GLOBAL_WEIGHT_FONTS_EN,
  GLOBAL_WEIGHT_FONTS_JA,
  GlobalWeight,
  TypographyTokens,
} from "../../constants/typography";

export type TypographyType = keyof typeof TypographyTokens;

type FontWeight = BrandWeight | GlobalWeight;
type FontMap = Readonly<Record<string, string>>;

const isBrandFont = (fontFamily: string) =>
  fontFamily.startsWith("MetrobankSans");

const inferDefaultWeight = (fontFamily: string): BrandWeight => {
  if (fontFamily === "MetrobankSans-Bold") return "bold";
  if (fontFamily === "MetrobankSans-Light") return "light";
  return "regular";
};

// The font for `weight` in this family, or the `fallback` weight's font when
// the family doesn't have that weight (e.g. Metrobank Sans has no semibold).
const pickFont = (
  fonts: FontMap,
  weight: FontWeight | undefined,
  fallback: FontWeight,
): string => (weight && fonts[weight]) || fonts[fallback];

type FontOptions = Readonly<{
  tokenFont: string;
  weight?: FontWeight;
  italic?: boolean;
  isJapanese: boolean;
}>;

const resolveFontFamily = ({
  tokenFont,
  weight,
  italic,
  isJapanese,
}: FontOptions): string => {
  const defaultWeight = inferDefaultWeight(tokenFont);

  // Metrobank Sans has no Japanese glyphs — every token, brand or global,
  // uses Noto Sans JP for Japanese text (never italic in Japanese).
  if (isJapanese) {
    return pickFont(GLOBAL_WEIGHT_FONTS_JA, weight, defaultWeight);
  }

  const brandFont = isBrandFont(tokenFont);

  // Real italic files rather than fontStyle: iOS doesn't slant custom fonts.
  if (italic) {
    return brandFont
      ? pickFont(BRAND_ITALIC_FONTS_EN, weight, defaultWeight)
      : pickFont(GLOBAL_ITALIC_FONTS_EN, weight, "regular");
  }

  if (!weight) return tokenFont;

  return brandFont
    ? pickFont(BRAND_WEIGHT_FONTS_EN, weight, defaultWeight)
    : pickFont(GLOBAL_WEIGHT_FONTS_EN, weight, "regular");
};

type AppTextProps = TextProps &
  Readonly<{
    typographyType: TypographyType;
    color?: string;
    weight?: FontWeight;
    italic?: boolean;
    fontSize?: number;
  }>;

export function AppText({
  typographyType,
  color,
  weight,
  italic,
  fontSize,
  style,
  children,
  ...rest
}: AppTextProps) {
  const locale = useAppSelector((s) => s.ui.locale);
  const token = TypographyTokens[typographyType];

  const tokenStyle: TextStyle = {
    fontFamily: resolveFontFamily({
      tokenFont: token.fontFamily,
      weight,
      italic,
      isJapanese: locale === "ja",
    }),
    fontSize: fontSize ?? token.fontSize,
    lineHeight: token.lineHeight,
    letterSpacing: token.letterSpacing,
  };

  return (
    <Text style={[tokenStyle, !!color && { color }, style]} {...rest}>
      {children}
    </Text>
  );
}
