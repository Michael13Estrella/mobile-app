/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-19
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import {
  LayoutRectangle,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Spacing } from "../../constants/spacing";
import { useAppTheme } from "../../hooks/useAppTheme";
import { AppText } from "./AppText";
import { useEffect, useRef } from "react";

// Must match AppScreen's content padding: the tabs run edge to edge
const SCREEN_PADDING = Spacing.s7;
// The selected tab's underline and the divider are both 1px, on one line.
const LINE_HEIGHT = 1;
const BADGE_SIZE = 16;

export type TabItem<T extends string> = Readonly<{
  value: T;
  label: string;
  // shown in a badge next to the label (e.g. how many items the tab has)
  count?: number;
}>;

type AppTabsProps<T extends string> = Readonly<{
  tabs: readonly TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
}>;

/**
 * Horizontal tabs with an underline on the selected one and optional count
 * badges. Scrolls sideways when the tabs don't fit.
 *
 * @example <AppTabs tabs={tabs} value={category} onChange={setCategory} />
 */
export function AppTabs<T extends string>({
  tabs,
  value,
  onChange,
}: AppTabsProps<T>) {
  const { colors } = useAppTheme();
  const scrollRef = useRef<ScrollView>(null);
  // Measured while rendering: each tab's position, the visible width and
  // the full row width (refs: measuring must not cause a re-render)
  const tabLayouts = useRef<Partial<Record<T, LayoutRectangle>>>({});
  const viewportWidth = useRef(0);
  const contentWidth = useRef(0);

  // Scroll the selected tab to the middle (showing its neighbor), clamped
  // so the first and last tabs stop at the edge
  useEffect(() => {
    const layout = tabLayouts.current[value];
    if (!layout) return;
    const centered = layout.x + layout.width / 2 - viewportWidth.current / 2;
    const maxScroll = Math.max(0, contentWidth.current - viewportWidth.current);
    scrollRef.current?.scrollTo({
      x: Math.min(Math.max(0, centered), maxScroll),
      animated: true,
    });
  }, [value]);

  return (
    <View accessibilityRole="tablist" style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        onLayout={(e) => {
          viewportWidth.current = e.nativeEvent.layout.width;
        }}
        onContentSizeChange={(width) => {
          contentWidth.current = width;
        }}
      >
        {tabs.map((tab) => {
          const isSelected = tab.value === value;
          const textColor = isSelected
            ? colors.textBrandPrimary
            : colors.textSecondary;

          return (
            <Pressable
              key={tab.value}
              onLayout={(e) => {
                tabLayouts.current[tab.value] = e.nativeEvent.layout;
              }}
              onPress={() => onChange(tab.value)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              style={[
                styles.tab,
                {
                  borderBottomColor: isSelected
                    ? colors.tabIndicator
                    : colors.borderDefault,
                },
              ]}
            >
              <AppText
                typographyType="overline1"
                weight={isSelected ? "bold" : "regular"}
                color={textColor}
                style={styles.label}
              >
                {tab.label}
              </AppText>
              {tab.count !== undefined && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: isSelected
                        ? colors.tabBadgeActiveBackground
                        : colors.tabBadgeBackground,
                    },
                  ]}
                >
                  <AppText typographyType="body4" color={textColor}>
                    {tab.count}
                  </AppText>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Starts at the content's left edge; runs off the right edge so the tabs
  // can scroll under it.
  container: {
    marginHorizontal: -SCREEN_PADDING,
  },
  row: {
    paddingHorizontal: SCREEN_PADDING,
  },
  // Every tab has a 1px bottom border, transparent unless selected, so the
  // selected one's underline lands exactly on the divider.
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s5,
    paddingVertical: Spacing.s3,
    borderBottomWidth: LINE_HEIGHT,
    borderBottomColor: "transparent",
  },
  // Uppercase by style, so the translations stay normal text
  label: {
    textTransform: "uppercase",
  },
  badge: {
    minWidth: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: Spacing.s2,
    paddingHorizontal: Spacing.s2,
    alignItems: "center",
    justifyContent: "center",
  },
});
