import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import { useAppTheme } from "../../hooks/useAppTheme";
import { GENDER_OPTIONS } from "../../constants/userFields";
import { FieldLabel } from "./FieldLabel";
import { FieldHelperText } from "./FieldHelperText";
import { Spacing } from "../../constants/spacing";
import { AppText } from "../common/AppText";

const RADIO_SIZE = 20;
const RADIO_INNER_SIZE = 8;

type AppGenderSelectProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  successText?: string;
}>;

export function AppGenderSelect<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  optional = false,
  hint,
  successText,
}: AppGenderSelectProps<T>) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  const {
    field: { onChange, onBlur, value },
    fieldState: { error, isTouched, isDirty },
  } = useController({ control, name });

  const showSuccess =
    !error && (isTouched || isDirty) && !!value && !!successText;

  // Choosing an option completes this field, so it counts as its "blur".
  const handleSelect = (
    optionValue: (typeof GENDER_OPTIONS)[number]["value"],
  ) => {
    onChange(optionValue);
    onBlur();
  };

  return (
    <View style={styles.container}>
      <FieldLabel label={label} required={required} optional={optional} />

      <View style={styles.optionsRow}>
        {GENDER_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <Pressable
              key={option.value}
              style={styles.optionRow}
              onPress={() => handleSelect(option.value)}
            >
              <View
                style={[
                  styles.radioOuter,
                  isSelected
                    ? {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      }
                    : {
                        backgroundColor: colors.surface,
                        borderColor: colors.borderDefault,
                      },
                ]}
              >
                {isSelected && (
                  <View
                    style={[
                      styles.radioDot,
                      { backgroundColor: colors.surface },
                    ]}
                  />
                )}
              </View>
              <AppText typographyType="body2" color={colors.textPrimary}>
                {t(option.labelKey)}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <FieldHelperText
        errorMessage={error?.message}
        showSuccess={showSuccess}
        successText={successText}
        hintText={hint}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.s3,
  },
  optionsRow: {
    flexDirection: "row",
    gap: Spacing.s6,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
  },
  radioOuter: {
    width: RADIO_SIZE,
    height: RADIO_SIZE,
    borderRadius: RADIO_SIZE / 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: RADIO_INNER_SIZE,
    height: RADIO_INNER_SIZE,
    borderRadius: RADIO_INNER_SIZE / 2,
  },
});
