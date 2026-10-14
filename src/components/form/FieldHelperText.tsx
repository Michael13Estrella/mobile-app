/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-08
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { Spacing } from "../../constants/spacing";
import { useAppTheme } from "../../hooks/useAppTheme";
import { BrandIcon } from "../icons";
import { AppText } from "../common/AppText";

const ICON_SIZE = 16;

type FieldHelperTextProps = Readonly<{
  errorMessage?: string;
  showSuccess?: boolean;
  successText?: string;
  hintText?: string;
}>;

// Shared error/success/info row for AppInput, AppSelect, AppDatePicker -
// mutually exclusive, in priority order: error > success > info
export function FieldHelperText({
  errorMessage,
  showSuccess = false,
  successText,
  hintText,
}: FieldHelperTextProps) {
  const { colors } = useAppTheme();

  if (errorMessage) {
    return (
      <View style={styles.helperRow}>
        <BrandIcon
          name="alertTriangleSolid"
          size={ICON_SIZE}
          color={colors.iconError}
        />
        <AppText typographyType="body4" color={colors.textError}>
          {errorMessage}
        </AppText>
      </View>
    );
  }

  if (showSuccess && successText) {
    return (
      <View style={styles.helperRow}>
        <BrandIcon
          name="checkCircleSolid"
          size={ICON_SIZE}
          color={colors.iconSuccess}
        />
        <AppText typographyType="body4" color={colors.textSuccess}>
          {successText}
        </AppText>
      </View>
    );
  }

  if (hintText) {
    return (
      <View style={styles.helperRow}>
        <BrandIcon
          name="infoSquareSolid"
          size={ICON_SIZE}
          color={colors.iconTertiary}
        />
        <AppText typographyType="body4" color={colors.textTertiary}>
          {hintText}
        </AppText>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  helperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
    marginRight: Spacing.s5,
  },
});
