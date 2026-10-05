import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Spacing } from "../../constants/spacing";
import { useTranslation } from "../../hooks/useTranslation";
import { AppText } from "../common/AppText";

type FieldLabelProps = Readonly<{
  label?: string;
  labelHelper?: string;
  required?: boolean;
  optional?: boolean;
}>;

// Shared label row for AppInput, AppSelect, AppDatePicker.
export function FieldLabel({
  label,
  labelHelper,
  required = false,
  optional = false,
}: FieldLabelProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  if (!label) return null;

  return (
    <View style={styles.fieldLabelContainer}>
      <View style={styles.labelRow}>
        <AppText typographyType="label2" color={colors.textPrimary}>
          {label}
        </AppText>
        {required && (
          <AppText
            typographyType="label2"
            color={colors.error}
            style={{ color: colors.error }}
          >
            *
          </AppText>
        )}
        {optional && !required && (
          <AppText typographyType="body4" color={colors.textSecondary} italic>
            {t("common.optional")}
          </AppText>
        )}
      </View>
      {!!labelHelper && (
        <View style={[styles.labelHelperRow]}>
          {/* <Text
            style={[styles.labelHelperText, { color: colors.textTertiary }]}
          >
            {labelHelper}
          </Text> */}
          <AppText typographyType="body4" color={colors.textTertiary}>
            {labelHelper}
          </AppText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldLabelContainer: {
    flex: 1,
    gap: Spacing.s2,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s2,
  },
  labelHelperRow: {
    flexDirection: "row",
  },
});
