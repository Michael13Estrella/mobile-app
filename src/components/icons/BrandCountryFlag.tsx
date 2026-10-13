/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-05
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { FC } from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";
import JpCircle from "../../../assets/flags/circle/jp.svg";
import PhCircle from "../../../assets/flags/circle/ph.svg";
import UsCircle from "../../../assets/flags/circle/us.svg";

import JpSquare from "../../../assets/flags/square/jp.svg";
import PhSquare from "../../../assets/flags/square/ph.svg";
import UsSquare from "../../../assets/flags/square/us.svg";

import JpRounded from "../../../assets/flags/rounded/jp.svg";
import PhRounded from "../../../assets/flags/rounded/ph.svg";
import UsRounded from "../../../assets/flags/rounded/us.svg";

export type FlagShape = "circle" | "rounded" | "square";

// Own flag artwork per shape, keyed by ISO alpha-2 code.
// Add a country: export its SVG into assets/flags/<shape>/ and list it here

const FLAGS: Readonly<
  Record<FlagShape, Readonly<Record<string, FC<SvgProps>>>>
> = {
  circle: { JP: JpCircle, PH: PhCircle, US: UsCircle },
  rounded: { JP: JpRounded, PH: PhRounded, US: UsRounded },
  square: { JP: JpSquare, PH: PhSquare, US: UsSquare },
};

type BrandCountryFlagProps = Readonly<{
  code: string; // ISO alpha-2, e.g. "JP"
  size: number;
  shape: FlagShape;
}>;

export function BrandCountryFlag({ code, size, shape }: BrandCountryFlagProps) {
  const FlagSvg = FLAGS[shape][code.toUpperCase()];

  // Unknown code: an empty space of the same size keeps layouts aligned
  if (!FlagSvg) {
    return <View style={{ width: size, height: size }} />;
  }
  return <FlagSvg width={size} height={size} />;
}
