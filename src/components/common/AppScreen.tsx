/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-15
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ComponentProps, ReactNode, useState } from "react";
import {
  LayoutChangeEvent,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Spacing } from "../../constants/spacing";
import { BrandIcon, BrandIconName } from "../icons";
import {
  REFRESH_INDICATOR_HEIGHT,
  usePullToRefresh,
} from "../../hooks/usePullToRefresh";
import Animated from "react-native-reanimated";
import {
  GestureDetector,
  ScrollView as GestureScrollView,
} from "react-native-gesture-handler";
import { AppToastHost } from "./AppToastHost";

// Gesture-handler's ScrollView, animatable for KeyboardAwareScrollView: only
// this one can run together with the pull-to-refresh gesture. With React
// Native's own ScrollView, a scrollable screen swallows every vertical drag.
const AnimatedGestureScrollView = Animated.createAnimatedComponent(
  GestureScrollView,
) as unknown as NonNullable<
  ComponentProps<typeof KeyboardAwareScrollView>["ScrollViewComponent"]
>;

// Space below the footer while the keyboard is closed (above the home
// indicator; Android has none of its own).
const BOTTOM_PADDING_EXTRA = Platform.OS === "ios" ? Spacing.s0 : Spacing.s5;
// Space between the footer and the open keyboard (both platforms).
const KEYBOARD_FOOTER_GAP = Spacing.s5;

// Space kept between a focused input and the sticky footer above the keyboard.
const FOCUSED_INPUT_GAP = Spacing.s10;

const REFRESH_ICON: BrandIconName = "refreshCw05Line";
const REFRESH_ICON_SIZE = 24;

// Space between the header (or the status bar) and the toast
const TOAST_TOP_GAP = Spacing.s4;

type GradientPoint = Readonly<{ x: number; y: number }>;
type GradientColors = [string, string, ...string[]];

const DEFAULT_GRADIENT_START: GradientPoint = { x: 0, y: 0 };
const DEFAULT_GRADIENT_END: GradientPoint = { x: 0, y: 1 };

type AppScreenProps = Readonly<{
  header?: ReactNode;
  footer?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  contentGap?: number;
  gradient?: boolean;
  gradientColors?: GradientColors;
  gradientStart?: GradientPoint;
  gradientEnd?: GradientPoint;
  children?: ReactNode;
  onRefresh?: () => Promise<unknown>;
}>;

export function AppScreen({
  header,
  footer,
  contentContainerStyle,
  contentGap,
  gradient,
  gradientColors,
  gradientStart = DEFAULT_GRADIENT_START,
  gradientEnd = DEFAULT_GRADIENT_END,
  children,
  onRefresh,
}: AppScreenProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);
  const pullToRefresh = usePullToRefresh({ onRefresh });

  const handleFooterLayout = (e: LayoutChangeEvent) =>
    setFooterHeight(e.nativeEvent.layout.height);

  // While the keyboard is open, the footer moves down by this much over it:
  // its bottom padding hides behind the keyboard, expect KEYBOARD_FOOTER_GAP
  const keyboardOpenOffset =
    insets.bottom + BOTTOM_PADDING_EXTRA - KEYBOARD_FOOTER_GAP;

  // The part of the footer above the open keyboard
  const visibleFooterHeight = footer
    ? Math.max(footerHeight - insets.bottom, 0)
    : 0;

  const resolveGradientColors: GradientColors = gradientColors ?? [
    colors.backgroundGradientStart,
    colors.backgroundGradientEnd,
  ];

  // The sticky footer slides over scroll content while the keyboard is open,
  // so it needs an opaque background matching the bottom of the screen.
  const footerBackground = gradient
    ? resolveGradientColors[resolveGradientColors.length - 1]
    : colors.background;

  // Reaches the inner gesture-handler ScrollView (KeyboardAwareScrollView
  // passes extra props through): run its scrolling together with the pull.
  // A spread, because KeyboardAwareScrollView's types don't list this prop.
  const scrollGestureProps = {
    simultaneousHandlers: pullToRefresh.pullRef,
  };

  const body = (
    <View
      style={[styles.fill, !gradient && { backgroundColor: colors.background }]}
    >
      {!!header && <View style={{ paddingTop: insets.top }}>{header}</View>}

      {/* Scroll area: the refresh icon sits behind it, revealed by the pull. */}
      <View style={styles.fill}>
        {pullToRefresh.isEnabled && (
          <View
            pointerEvents="none"
            style={[styles.refreshIndicator, { top: header ? 0 : insets.top }]}
          >
            <Animated.View style={pullToRefresh.indicatorStyle}>
              <BrandIcon
                name={REFRESH_ICON}
                size={REFRESH_ICON_SIZE}
                color={colors.iconBrandPrimary}
              />
            </Animated.View>
          </View>
        )}

        <GestureDetector gesture={pullToRefresh.pullGesture}>
          <Animated.View style={[styles.fill, pullToRefresh.contentStyle]}>
            <KeyboardAwareScrollView
              style={[styles.transparent, styles.fill]}
              contentContainerStyle={[
                styles.content,
                { gap: contentGap === undefined ? Spacing.s7 : contentGap },
                !header && { paddingTop: insets.top },
                !footer && {
                  paddingBottom: insets.bottom + BOTTOM_PADDING_EXTRA,
                },
                contentContainerStyle,
              ]}
              bottomOffset={visibleFooterHeight + FOCUSED_INPUT_GAP}
              keyboardShouldPersistTaps="handled"
              ScrollViewComponent={AnimatedGestureScrollView}
              {...scrollGestureProps}
              showsVerticalScrollIndicator={false}
              onScroll={pullToRefresh.onScroll}
              // The custom pull replaces iOS's bounce at the top.
              bounces={!pullToRefresh.isEnabled}
            >
              {children}
            </KeyboardAwareScrollView>
          </Animated.View>
        </GestureDetector>

        {/* Floats over the content, right under the header */}
        <AppToastHost
          top={header ? TOAST_TOP_GAP : insets.top + TOAST_TOP_GAP}
        />
      </View>

      {!!footer && (
        <KeyboardStickyView
          offset={{ opened: keyboardOpenOffset }}
          onLayout={handleFooterLayout}
          style={[
            styles.footer,
            {
              backgroundColor: footerBackground,
              paddingBottom: insets.bottom + BOTTOM_PADDING_EXTRA,
            },
          ]}
        >
          {footer}
        </KeyboardStickyView>
      )}
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={resolveGradientColors}
        start={gradientStart}
        end={gradientEnd}
        style={styles.fill}
      >
        {body}
      </LinearGradient>
    );
  }

  return body;
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  refreshIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    height: REFRESH_INDICATOR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexGrow: 1,
    padding: Spacing.s7,
  },
  transparent: {
    backgroundColor: "transparent",
  },
  footer: {
    paddingTop: Spacing.s5,
    paddingHorizontal: Spacing.s7,
    gap: Spacing.s5,
  },
});
