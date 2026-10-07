/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View, Text } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Typography } from "../../constants/typography";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

const DEFAULT_SIZE = 64;
const STROKE_WIDTH = 4;

type ProgressNumberCircleProps = Readonly<{
  number: number;
  progress: number; // 0 to 100
  size?: number;
  textColor?: string;
}>;

export function ProgressNumberCircle({
  number,
  progress,
  size = DEFAULT_SIZE,
  textColor,
}: ProgressNumberCircleProps) {
  const { colors } = useAppTheme();
  const radius = (size - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const dashOffset = circumference * (1 - clampedProgress / 100);
  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#8537A7" />
            <Stop offset="1" stopColor="#079ED8" />
          </LinearGradient>
        </Defs>
        {/* Background track - the "remaining" portion */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.borderDefault}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {/* Progress arc - the "completed" portion */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90, ${center}, ${center})`}
        />
      </Svg>
      <View style={styles.numberOverlay}>
        <Text
          style={[
            styles.numberText,
            { color: textColor ?? colors.textBrandPrimary },
          ]}
        >
          {number}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  numberOverlay: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
});
