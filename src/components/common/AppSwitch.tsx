/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-18
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Pressable, StyleSheet } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Spacing } from "../../constants/spacing";
import { resolveShadows } from "../../theme/shadows";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

const TRACK_WIDTH = 32;
const TRACK_HEIGHT = 16;
// Larger than the track: it sticks out above and below it
const THUMB_SIZE = 20;
// How far the thumb moves from off to on
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE;
const TOGGLE_ANIMATION = { duration: 200 };
const DISABLED_OPACITY = 0.5;
const HIT_SLOP = Spacing.s3;

const OFF = 0;
const ON = 1;

type AppSwitchProps = Readonly<{
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}>;

/**
 * An on/off switch in the app's design (the same on iOS and Android): a
 * light track with a larger round thumb that slides over it, grey when
 * off and green when on.
 *
 * @example <AppSwitch value={isEnabled} onValueChange={setIsEnabled} />
 */
export function AppSwitch({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
}: AppSwitchProps) {
  const { colors } = useAppTheme();
  const shadows = resolveShadows(colors);

  // 0 = off, 1 = on; animates between them
  const progress = useSharedValue(value ? ON : OFF);

  useEffect(() => {
    progress.value = withTiming(value ? ON : OFF, TOGGLE_ANIMATION);
  }, [value, progress]);

  const trackAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [OFF, ON],
      [colors.switchTrackOff, colors.switchTrackOn],
    ),
  }));

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [OFF, ON],
      [colors.switchThumbOff, colors.switchThumbOn],
    ),
    transform: [{ translateX: progress.value * THUMB_TRAVEL }],
  }));

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      style={[styles.container, disabled && styles.disabled]}
    >
      <Animated.View style={[styles.track, trackAnimatedStyle]} />
      <Animated.View
        style={[
          styles.thumb,
          { boxShadow: shadows.neutral02Bottom },
          thumbAnimatedStyle,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // As tall as the thumb, so the thumb's overhang isn't cut off
  container: {
    width: TRACK_WIDTH,
    height: THUMB_SIZE,
    justifyContent: "center",
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: "absolute",
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
  disabled: {
    opacity: DISABLED_OPACITY,
  },
});
