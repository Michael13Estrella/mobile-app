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

const TRACK_RADIUS = Spacing.s5;
const SEGMENTED_RADIUS = Spacing.s4;

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
}>;

// Pick one of a fex options: a grey track with the selected one raised.
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const { colors } = useAppTheme();
  const shadows = resolveShadows(colors);

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.track,
        { backgroundColor: colors.buttonDisabledBackground },
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
              isSelected && {
                backgroundColor: colors.surface,
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
    borderRadius: TRACK_RADIUS,
    padding: Spacing.s2,
    gap: Spacing.s2,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.s3,
    paddingVertical: Spacing.s3,
    borderRadius: SEGMENTED_RADIUS,
  },
});
