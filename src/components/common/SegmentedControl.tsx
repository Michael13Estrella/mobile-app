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

import { ReactNode } from "react";
import { Spacing } from "../../constants/spacing";
import { useAppTheme } from "../../hooks/useAppTheme";
import { resolveShadows } from "../../theme/shadows";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "./AppText";
import { FIELD_SIZE } from "../../theme/field";

// rounded: rounded corners (e.g. form fields)
// pill: fully round ends
export type SegmentedControlVariant = "rounded" | "pill";

// Larger than any control's height, so the ends are always half circles
const PILL_RADIUS = 999;

const RADIUS_BY_VARIANT: Readonly<
  Record<SegmentedControlVariant, Readonly<{ track: number; segment: number }>>
> = {
  rounded: { track: Spacing.s5, segment: Spacing.s4 },
  pill: { track: PILL_RADIUS, segment: PILL_RADIUS },
};

export type SegmentOption<T extends string> = Readonly<{
  value: T;
  label: string;
  // Shown before the label (e.g. a flag)
  icon?: ReactNode;
}>;

type SegmentedControlProps<T extends string> = Readonly<{
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
  variant?: SegmentedControlVariant;
}>;

// Pick one of a few options: a grey track with the selected one raised.
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
  variant = "rounded",
}: SegmentedControlProps<T>) {
  const { colors } = useAppTheme();
  const shadows = resolveShadows(colors);
  const radius = RADIUS_BY_VARIANT[variant];

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.track,
        {
          backgroundColor: colors.segmentedControlBackground,
          borderRadius: radius.track,
        },
      ]}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={option.label}
            style={[
              styles.segment,
              { borderRadius: radius.segment },
              isSelected && {
                backgroundColor: colors.segmentedControlSelected,
                boxShadow: shadows.neutral02Bottom,
              },
            ]}
          >
            {option.icon}
            <AppText
              typographyType="label2"
              weight="bold"
              color={isSelected ? colors.textPrimary : colors.textSecondary}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: Spacing.s2,
    gap: Spacing.s0,
    height: FIELD_SIZE.height,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.s3,
    paddingVertical: Spacing.s3,
  },
});
