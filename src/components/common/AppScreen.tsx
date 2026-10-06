import { ReactNode, useState } from "react";
import {
  LayoutChangeEvent,
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

// Space below the footer (keyboard closed: above the home indicator;
// keyboard open: between the footer and the keyboard).
const BOTTOM_PADDING_EXTRA = Spacing.s7;
// Space kept between a focused input and the sticky footer above the keyboard.
const FOCUSED_INPUT_GAP = Spacing.s10;

type GradientPoint = Readonly<{ x: number; y: number }>;
type GradientColors = [string, string, ...string[]];

const DEFAULT_GRADIENT_START: GradientPoint = { x: 0, y: 0 };
const DEFAULT_GRADIENT_END: GradientPoint = { x: 0, y: 1 };

type AppScreenProps = Readonly<{
  header?: ReactNode;
  footer?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  gradient?: boolean;
  gradientColors?: GradientColors;
  gradientStart?: GradientPoint;
  gradientEnd?: GradientPoint;
  children?: ReactNode;
}>;

export function AppScreen({
  header,
  footer,
  contentContainerStyle,
  gradient,
  gradientColors,
  gradientStart = DEFAULT_GRADIENT_START,
  gradientEnd = DEFAULT_GRADIENT_END,
  children,
}: AppScreenProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);

  const handleFooterLayout = (e: LayoutChangeEvent) =>
    setFooterHeight(e.nativeEvent.layout.height);

  // The keyboard covers the safe-area inset while open, so that part of the
  // footer's padding is hidden behind it; only the rest sits above the keyboard.
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

  const body = (
    <View
      style={[styles.fill, !gradient && { backgroundColor: colors.background }]}
    >
      {!!header && <View style={{ paddingTop: insets.top }}>{header}</View>}

      <KeyboardAwareScrollView
        style={[styles.transparent, styles.fill]}
        contentContainerStyle={[
          styles.content,
          !header && { paddingTop: insets.top },
          !footer && {
            paddingBottom: insets.bottom + BOTTOM_PADDING_EXTRA,
          },
          contentContainerStyle,
        ]}
        bottomOffset={visibleFooterHeight + FOCUSED_INPUT_GAP}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </KeyboardAwareScrollView>

      {!!footer && (
        <KeyboardStickyView
          offset={{ opened: insets.bottom }}
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
  content: {
    flexGrow: 1,
    padding: Spacing.s7,
    gap: Spacing.s7,
  },
  transparent: {
    backgroundColor: "transparent",
  },
  footer: {
    paddingTop: Spacing.s7,
    paddingHorizontal: Spacing.s7,
    gap: Spacing.s5,
  },
});
