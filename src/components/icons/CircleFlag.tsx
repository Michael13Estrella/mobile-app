import { FC } from "react";
import { SvgProps } from "react-native-svg";
import JpFlag from "../../../assets/flags/circle/jp.svg";
import PhFlag from "../../../assets/flags/circle/ph.svg";
import UsFlag from "../../../assets/flags/circle/us.svg";
import { View } from "react-native";

const CIRCLE_FLAGS: Readonly<Record<string, FC<SvgProps>>> = {
  JP: JpFlag,
  PH: PhFlag,
  US: UsFlag,
};

type CircleFlagProps = Readonly<{
  code: string; // ISO alpha-2, e.g. "JP"
  size: number;
}>;

export function CircleFlag({ code, size }: CircleFlagProps) {
  const Flag = CIRCLE_FLAGS[code.toUpperCase()];

  // Unknown code: an empty space of the same size keeps layouts aligned
  if (!Flag) {
    return <View style={{ width: size, height: size }} />;
  }
  return <Flag width={size} height={size} />;
}
