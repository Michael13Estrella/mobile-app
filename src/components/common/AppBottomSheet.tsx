/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-29
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ReactNode, useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { Spacing } from "../../constants/spacing";

export const SHEET_RADIUS = 24;
const SHEET_MAX_HEIGHT = "87%";
const SHEET_ANIMATION_MS = 250;
const SHEET_ANIMATION = {
  duration: SHEET_ANIMATION_MS,
  easing: Easing.out(Easing.cubic),
};
const BACKDROP_BLUR_INTENSITY = 7;

// dim: a dark see-through layer (pickers); blur: the screen blurred behind
// it as well (confirmations)
export type SheetBackdrop = "dim" | "blur";

type AppBottomSheetProps = Readonly<{
  visible: boolean;
  // Backdrop tap, Android back, or the sheet's own buttons
  onClose: () => void;
  backdrop?: SheetBackdrop;
  children: ReactNode;
}>;

/**
 * A sheet that slides up from the bottom over a backdrop, sized to its
 * content (up to most of the screen). Closing is animated too: it stays
 * mounted until it has slid out.
 *
 * @example <AppBottomSheet visible={isOpen} onClose={close} backdrop="blur">…</AppBottomSheet>
 */
export function AppBottomSheet({
  visible,
  onClose,
  backdrop = "dim",
  children,
}: AppBottomSheetProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  // 0 = hidden below the screen, 1 = fully open
  const progress = useSharedValue(0);
  // Stays true until the slide-out has finished, so closing is animated too
  const [isMounted, setIsMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      progress.value = withTiming(1, SHEET_ANIMATION);
      return;
    }

    progress.value = withTiming(0, SHEET_ANIMATION);
    const timer = setTimeout(() => setIsMounted(false), SHEET_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [visible, progress]);

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * windowHeight }],
  }));

  if (!isMounted) return null;

  return (
    <Modal
      visible
      transparent
      // The slide/fade is done with Reanimated; the native animation would
      // also slide the backdrop
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        {/* Backdrop: fades in/out, tap to close */}
        <Animated.View style={[StyleSheet.absoluteFill, backdropAnimatedStyle]}>
          {backdrop === "blur" && (
            <BlurView
              intensity={BACKDROP_BLUR_INTENSITY}
              // Android only blurs with this method (iOS ignores it)
              blurMethod={
                Platform.OS === "android" ? "dimezisBlurViewSdk31Plus" : "none"
              }
              style={StyleSheet.absoluteFill}
            />
          )}
          <Pressable
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.overlay },
            ]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t("common.close")}
          />
        </Animated.View>

        {/* Sheet: slides up from below the screen */}
        <Animated.View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + Spacing.s7,
            },
            sheetAnimatedStyle,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: SHEET_MAX_HEIGHT,
    borderTopLeftRadius: SHEET_RADIUS,
    borderTopRightRadius: SHEET_RADIUS,
    paddingTop: Spacing.s7,
    paddingHorizontal: Spacing.s7,
  },
});
