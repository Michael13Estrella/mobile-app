/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-08
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import { Spacing } from "../../constants/spacing";
import { BrandIcon, BrandIconName } from "../icons";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "../common/AppText";
import { GradientText } from "../common/GradientText";

const TAB_ICON_SIZE = 24;
const BAR_RADIUS = Spacing.s7;
const BAR_BORDER_WIDTH = 1;
// Raised "Send Money" button in the middle of the bar.
const CENTER_BUTTON_SIZE = 48;
const CENTER_RING_WIDTH = 2;
// How far the circle is lifted above the other icons (0 = centered on them)
const CENTER_BUTTON_RAISE = 14;
const RING_GRADIENT_START = { x: 0, y: 0 };
const RING_GRADIENT_END = { x: 1, y: 1 };

type TabConfig = Readonly<{
  labelKey: string;
  icon: BrandIconName;
  // Icon when the tab is selected (e.g. filled); defaults to `icon`
  activeIcon?: BrandIconName;
  isCenter?: boolean;
}>;

// Keyed by route file name in app/(protected)/(tabs)/.
const TAB_CONFIG: Readonly<Record<string, TabConfig>> = {
  home: {
    labelKey: "tabs.home",
    icon: "home03Solid",
  },
  beneficiaries: {
    labelKey: "tabs.beneficiaries",
    icon: "users01Line",
  },
  "send-money": {
    labelKey: "tabs.sendMoney",
    icon: "bankNote01Line",
    isCenter: true,
  },
  "pay-bills": {
    labelKey: "tabs.payBills",
    icon: "receiptCheckLine",
  },
  more: {
    labelKey: "tabs.more",
    icon: "dotsHorizontalLine",
  },
};

export function AppTabBar({ state, navigation }: Readonly<BottomTabBarProps>) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: colors.backgroundGradientEnd }}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.surface,
            borderColor: colors.borderSubtle,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[route.name];
          if (!config) return null;

          const isFocused = state.index === index;
          const label = t(config.labelKey);

          // Standard tab press: lets screens listen to "tabPress"
          // (e.g. scroll to top when the active tab is tapped again)
          const handlePress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const iconName =
            isFocused && config.activeIcon ? config.activeIcon : config.icon;
          const icon = (
            <BrandIcon
              name={iconName}
              size={TAB_ICON_SIZE}
              color={colors.iconTertiary}
              // Selected tab and the center button use the brand gradient
              gradient={isFocused || config.isCenter}
            />
          );

          return (
            <Pressable
              key={route.key}
              onPress={handlePress}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: isFocused }}
              style={styles.tab}
            >
              {config.isCenter ? (
                <View style={styles.centerSlot}>
                  {/* Gradient ring: a gradient circle with a white circle inside,
                 so the gradient shoes as the border */}
                  <LinearGradient
                    colors={[
                      colors.brandGradientStart,
                      colors.brandGradientEnd,
                    ]}
                    start={RING_GRADIENT_START}
                    end={RING_GRADIENT_END}
                    style={styles.centerRing}
                  >
                    <View
                      style={[
                        styles.centerInner,
                        { backgroundColor: colors.surface },
                      ]}
                    >
                      {icon}
                    </View>
                  </LinearGradient>
                </View>
              ) : (
                icon
              )}
              {isFocused ? (
                <GradientText
                  typographyType="title4"
                  weight="bold"
                  numberOfLines={1}
                >
                  {label}
                </GradientText>
              ) : (
                <AppText
                  typographyType="title4"
                  weight="regular"
                  numberOfLines={1}
                >
                  {label}
                </AppText>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    // Same width on all sides (Android draws rounded corners reliably only
    // then); the negative margin pushes the bottom line off the screen.
    borderWidth: BAR_BORDER_WIDTH,
    marginBottom: -BAR_BORDER_WIDTH,
    borderTopLeftRadius: BAR_RADIUS,
    borderTopRightRadius: BAR_RADIUS,
    paddingTop: Spacing.s3,
    paddingHorizontal: Spacing.s3,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.s3,
  },
  centerSlot: {
    height: TAB_ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  centerRing: {
    width: CENTER_BUTTON_SIZE,
    height: CENTER_BUTTON_SIZE,
    borderRadius: CENTER_BUTTON_SIZE / 2,
    padding: CENTER_RING_WIDTH,
    // Moves only the drawing (not the layout), so the raise is exact
    transform: [{ translateY: -CENTER_BUTTON_RAISE }],
  },
  centerInner: {
    flex: 1,
    borderRadius: CENTER_BUTTON_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
