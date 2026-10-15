/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-14
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { Gesture, GestureType } from "react-native-gesture-handler";
import {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// Pull distance (after resistance) that refreshes on release
const PULL_THRESHOLD = 64;
// Where the content rest while refreshing (room for the icon above it)
export const REFRESH_INDICATOR_HEIGHT = 56;
// The content follows the finger at half speed, like a rubber band
const PULL_RESISTANCE = 0.5;
// Downward movement before a pull starts (taps still go through)
const PULL_ACTIVATION = 10;
// A sideways swipe this long is not a pull (e.g. the beneficiary row)
const SIDEWAYS_FAIL = 20;
const SPIN_DURATION_MS = 800;
const FULL_TURN_DEG = 360;

// Shortest time the spinner shows, even when the refresh is faster.
const MIN_REFRESH_MS = 1000;

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

type UsePullToReleaseOptions = Readonly<{
  // Omit to disable pull-to-refresh. The spinner runs until it resolves.
  onRefresh?: () => Promise<unknown>;
}>;

// Custom pull-to-refresh: refreshes on RELEASE past the threshold (the
// build-in RefreshControl refreshes mid-pull on iOS and has no custom icon)
export function usePullToRefresh({ onRefresh }: UsePullToReleaseOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pull = useSharedValue(0); // current pull distance
  const pullStart = useSharedValue(0); // finger position when the pull began
  const scrollY = useSharedValue(0);
  const spin = useSharedValue(0);
  const refreshing = useSharedValue(false);

  // Hold the content open and spin while refreshing; slide back after
  useEffect(() => {
    refreshing.value = isRefreshing;
    if (isRefreshing) {
      pull.value = withTiming(REFRESH_INDICATOR_HEIGHT);
      spin.value = 0;
      spin.value = withRepeat(
        withTiming(FULL_TURN_DEG, {
          duration: SPIN_DURATION_MS,
          easing: Easing.linear,
        }),
        -1,
      );
    } else {
      cancelAnimation(spin);
      pull.value = withTiming(0);
    }
  }, [isRefreshing, pull, spin, refreshing]);

  const startRefresh = useCallback(async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);

    try {
      // Spin at least MIN_REFRESH_MS, so a fast refresh is still visible
      await Promise.all([onRefresh(), wait(MIN_REFRESH_MS)]);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh]);

  // The scroll view's own gesture, so the pull can run alongside it.
  const pullRef = useRef<GestureType | undefined>(undefined);

  const pullGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!!onRefresh)
        .runOnJS(true)
        .activeOffsetY(PULL_ACTIVATION)
        .failOffsetX([-SIDEWAYS_FAIL, SIDEWAYS_FAIL])
        .withRef(pullRef)
        .onStart((e) => {
          pullStart.value = e.translationY;
        })
        .onUpdate((e) => {
          if (isRefreshing) return;
          // Only pull once the content is at the very top; until then the
          // finger is scrolling, so the pull starts from where it reaches it.
          if (scrollY.value > 0) {
            pullStart.value = e.translationY;
            return;
          }
          pull.value = Math.max(
            0,
            (e.translationY - pullStart.value) * PULL_RESISTANCE,
          );
        })
        .onEnd(() => {
          if (isRefreshing) return;
          if (pull.value >= PULL_THRESHOLD) {
            void startRefresh();
          } else {
            pull.value = withSpring(0);
          }
        }),
    [onRefresh, isRefreshing, startRefresh, pullRef, pull, pullStart, scrollY],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.value = e.nativeEvent.contentOffset.y;
    },
    [scrollY],
  );

  // The content moves down with the pull
  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pull.value }],
  }));

  // The icon fades in with the pull and turns once by the threshold;
  // while refreshing it spins.
  const indicatorStyle = useAnimatedStyle(() => {
    const rotation = refreshing.value
      ? spin.value
      : interpolate(
          pull.value,
          [0, PULL_THRESHOLD],
          [0, FULL_TURN_DEG],
          Extrapolation.CLAMP,
        );
    return {
      opacity: interpolate(
        pull.value,
        [0, REFRESH_INDICATOR_HEIGHT],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  return {
    isEnabled: !!onRefresh,
    pullGesture,
    pullRef,
    onScroll,
    contentStyle,
    indicatorStyle,
  };
}
