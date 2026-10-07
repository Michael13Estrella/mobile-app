/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-06
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { AppColors } from "../../constants/colors";
import { useAppTheme } from "../../hooks/useAppTheme";
import { BrandIcon, BrandIconName } from "../icons";

const DEFAULT_SIZE = 40;
// Proportions taken from the design, relative to the outer (halo) size.
const INNER_CIRCLE_RATIO = 0.7;
const GLYPH_RATIO = 0.35;
// The halo is the status color, very light.
const HALO_OPACITY = 0.1;

export type StatusIconType = "pending" | "success" | "failed";

const STATUS_STYLES: Readonly<
  Record<StatusIconType, { icon: BrandIconName; color: keyof AppColors }>
> = {
  pending: { icon: "hourglass01Line", color: "statusPending" },
  success: { icon: "checkLine", color: "statusSuccess" },
  failed: { icon: "xLine", color: "statusFailed" },
};

type StatusIconProps = Readonly<{
  status: StatusIconType;
  // Outer diameter (halo); the circle and glyph scale with it.
  size?: number;
  // Read by screen readers, e.g. "Pending"
  accessibilityLabel?: string;
}>;

export function StatusIcon({
  status,
  size = DEFAULT_SIZE,
  accessibilityLabel,
}: StatusIconProps) {
  const { colors } = useAppTheme();
  const { icon, color } = STATUS_STYLES[status];
  const statusColor = colors[color];

  const innerSize = size * INNER_CIRCLE_RATIO;

  return (
    <View
      accessible={!!accessibilityLabel}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[styles.center, { width: size, height: size }]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: size / 2,
            backgroundColor: statusColor,
            opacity: HALO_OPACITY,
          },
        ]}
      />
      <View
        style={[
          styles.center,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            backgroundColor: statusColor,
          },
        ]}
      >
        <BrandIcon
          name={icon}
          size={size * GLYPH_RATIO}
          color={colors.statusIconForeground}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
