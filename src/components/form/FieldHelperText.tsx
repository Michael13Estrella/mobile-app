import { StyleSheet, View, Text } from "react-native";
import { Spacing } from "../../constants/spacing";
import { Typography } from "../../constants/typography";
import { useAppTheme } from "../../hooks/useAppTheme";
import { BrandIcon } from "../icons";

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
          size={14}
          color={colors.iconError}
        />
        <Text style={[styles.helperText, { color: colors.textError }]}>
          {errorMessage}
        </Text>
      </View>
    );
  }

  if (showSuccess && successText) {
    return (
      <View style={styles.helperRow}>
        <BrandIcon
          name="checkCircleSolid"
          size={14}
          color={colors.iconSuccess}
        />
        <Text style={[styles.helperText, { color: colors.textSuccess }]}>
          {successText}
        </Text>
      </View>
    );
  }

  if (hintText) {
    return (
      <View style={styles.helperRow}>
        <BrandIcon
          name="infoSquareSolid"
          size={14}
          color={colors.iconSecondary}
        />
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {hintText}
        </Text>
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
  helperText: {
    fontSize: Typography.sizes.xs,
  },
});
