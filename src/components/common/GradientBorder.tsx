/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-13
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

type GradientPoint = Readonly<{ x: number; y: number }>;

// Only the mask's alpha matters: opaque = show the gradient there.
const MASK_COLOR = "black";

type GradientBorderProps = Readonly<{
  colors: readonly [string, string, ...string[]];
  locations?: readonly [number, number, ...number[]];
  start: GradientPoint;
  end: GradientPoint;
  radius: number;
  width: number;
}>;

// Gradient outline (CSS border-image) for see-through surfaces: the gradient
// is masked to a ring, so the inside stays transparent. Place it as the last
// child of a view with the same radius.
export function GradientBorder({
  colors,
  locations,
  start,
  end,
  radius,
  width,
}: GradientBorderProps) {
  return (
    <MaskedView
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      maskElement={
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: radius,
              borderWidth: width,
              borderColor: MASK_COLOR,
            },
          ]}
        />
      }
    >
      <LinearGradient
        colors={colors}
        locations={locations}
        start={start}
        end={end}
        style={StyleSheet.absoluteFill}
      />
    </MaskedView>
  );
}
