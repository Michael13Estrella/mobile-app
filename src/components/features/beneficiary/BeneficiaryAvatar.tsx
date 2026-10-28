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

import { ReactNode } from "react";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { resolveShadows } from "../../../theme/shadows";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const DEFAULT_SIZE = 40;
const GRADIENT_START = { x: 0, y: 1 };
const GRADIENT_END = { x: 0, y: 0 };

type BeneficiaryAvatarProps = Readonly<{
  // Diameter of the circle
  size?: number;
  // What's inside: an icon or the initials
  children: ReactNode;
  // Placement only (e.g. alignSelf); the look stays fixed
  style?: StyleProp<ViewStyle>;
}>;

/**
 * The round avatar of a beneficiary: a light blue-to-white gradient with a
 * soft shadow. The shadow is on an outer View: the gradient clips to its
 * round corners, which would cut the shadow off.
 *
 * @example <BeneficiaryAvatar><BrandIcon name="user01Line" /></BeneficiaryAvatar>
 */
export function BeneficiaryAvatar({
  size = DEFAULT_SIZE,
  children,
  style,
}: BeneficiaryAvatarProps) {
  const { colors } = useAppTheme();
  const shadows = resolveShadows(colors);

  const circle = { width: size, height: size, borderRadius: size / 2 };

  return (
    <View style={[circle, { boxShadow: shadows.neutral02Bottom }, style]}>
      <LinearGradient
        colors={[colors.avatarGradientStart, colors.avatarGradientEnd]}
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={[styles.gradient, circle]}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    alignItems: "center",
    justifyContent: "center",
  },
});
