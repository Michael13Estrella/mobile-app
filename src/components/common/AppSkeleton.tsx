/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-30
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useEffect } from "react";
import { DimensionValue, StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Spacing } from "../../constants/spacing";

const PULSE_DURATION_MS = 800;
const PULSE_MIN_OPACITY = 0.4;
const PULSE_MAX_OPACITY = 1;
const DEFAULT_RADIUS = Spacing.s2;

type AppSkeletonProps = Readonly<{
  width?: DimensionValue;
  height: number;
  // A circle of `height` (avatars, flags)
  circle?: boolean;
  radius?: number;
  // Replaces the default color on dark backgrounds, like the wallet card
  color?: string;
  // Placement only (margins, alignSelf)
  style?: StyleProp<ViewStyle>;
}>;

/**
 * A grey placeholder in the shape of content that's still loading, gently
 * pulsing (still when the user has "Reduce Motion" on). Hidden from screen
 * readers: the loading state is announced by the screen, not every block.
 *
 * @example <AppSkeleton width="60%" height={16} />
 * @example <AppSkeleton circle height={50} />
 */
export function AppSkeleton({
  width = "100%",
  height,
  circle = false,
  radius = DEFAULT_RADIUS,
  color,
  style,
}: AppSkeletonProps) {
  const { colors } = useAppTheme();
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(PULSE_MAX_OPACITY);

  useEffect(() => {
    if (reduceMotion) return;

    opacity.value = withRepeat(
      withTiming(PULSE_MIN_OPACITY, {
        duration: PULSE_DURATION_MS,
        easing: Easing.inOut(Easing.ease),
      }),
      // Forever, back and forth
      -1,
      true,
    );
    return () => cancelAnimation(opacity);
  }, [reduceMotion, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        {
          width: circle ? height : width,
          height,
          borderRadius: circle ? height / 2 : radius,
          backgroundColor: color ?? colors.skeleton,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
