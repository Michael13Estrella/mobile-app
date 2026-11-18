/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-18
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Switch } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";

type AppSwitchProps = Readonly<{
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}>;

/**
 * An on/off switch in the app's colors (the same on iOS and Android).
 *
 * @example <AppSwitch value={isEnabled} onValueChange={setIsEnabled} />
 */
export function AppSwitch({
  value,
  onValueChange,
  disabled = false,
  accessibilityLabel,
}: AppSwitchProps) {
  const { colors } = useAppTheme();

  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
      thumbColor={colors.switchThumb}
      ios_backgroundColor={colors.switchTrackOff}
    />
  );
}
