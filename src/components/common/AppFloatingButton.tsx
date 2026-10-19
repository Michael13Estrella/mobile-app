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

import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { resolveShadows } from "../../theme/shadows";
import { BrandIconName } from "../icons";
import { Spacing } from "../../constants/spacing";
import { AppButton } from "./AppButton";

type AppFloatingButtonProps = Readonly<{
  label: string;
  icon?: BrandIconName;
  onPress: () => void;
}>;

/**
 * A gradient button floating at the bottom right of a screen, above the
 * content (e.g. "+ Add"). Place it as the screen's last child
 *
 * @example <AppFloatingButton label="Add" icon="plusLine" onPress={add} />
 */
export function AppFloatingButton({
  label,
  icon,
  onPress,
}: AppFloatingButtonProps) {
  const { colors } = useAppTheme();
  const shadows = resolveShadows(colors);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { boxShadow: shadows.neutral02Bottom }]}
    >
      <AppButton
        label={label}
        icon={icon}
        variant="gradient"
        fullWidth={false}
        onPress={onPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: Spacing.s7,
    bottom: Spacing.s7,
    borderRadius: Spacing.s7,
  },
});
