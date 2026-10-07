/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-14
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

type GradientPoint = Readonly<{ x: number; y: number }>;

type AppBackgroundProps = Readonly<{
  colors: [string, string, ...string[]];
  start?: GradientPoint;
  end?: GradientPoint;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}>;

const DEFAULT_START: GradientPoint = { x: 0, y: 0 };
const DEFAULT_END: GradientPoint = { x: 1, y: 1 };

export function AppBackground({
  colors,
  start = DEFAULT_START,
  end = DEFAULT_END,
  style,
  children,
}: AppBackgroundProps) {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.fill, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
