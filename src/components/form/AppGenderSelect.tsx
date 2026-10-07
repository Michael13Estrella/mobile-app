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

import { Pressable, StyleSheet, View } from "react-native";
import { Control, FieldValues, Path } from "react-hook-form";
import { useTranslation } from "../../hooks/useTranslation";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useFormField } from "../../hooks/useFormField";
import { GENDER_OPTIONS } from "../../constants/userFields";
import { Spacing } from "../../constants/spacing";
import { FIELD_SIZE } from "../../theme/field";
import { AppText } from "../common/AppText";
import { FieldShell } from "./FieldShell";

type GenderValue = (typeof GENDER_OPTIONS)[number]["value"];

type AppGenderSelectProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  successText?: string;
}>;

// Gender as two side-by-side option buttons (one choice).
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

  const { value, onChange, onBlur, errorMessage, showSuccess } = useFormField({
    control,
    name,
    successText,
  });

  // Choosing an option completes this field, so it counts as its "blur".
  // Optional field: tapping the selected option again clear the choice
  const handlePress = (optionValue: GenderValue) => {
    const isSelected = value === optionValue;
    if (isSelected && !optional) return;

    onChange(isSelected ? "" : optionValue);
    onBlur();
  };

  return (
    <FieldShell
      label={label}
      required={required}
      optional={optional}
      errorMessage={errorMessage}
      showSuccess={showSuccess}
      successText={successText}
      hint={hint}
    >
      <View style={styles.options} accessibilityRole="radiogroup">
        {GENDER_OPTIONS.map((option) => {
          const isSelected = value === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => handlePress(option.value)}
              accessibilityRole={optional ? "togglebutton" : "radio"}
              accessibilityState={
                optional ? { selected: isSelected } : { checked: isSelected }
              }
              style={[
                styles.option,
                { backgroundColor: colors.surface },
                isSelected
                  ? [
                      styles.selected,
                      { borderColor: colors.inputBorderFocused },
                    ]
                  : [
                      styles.unselected,
                      // Error: unselected options show the field's error border.
                      !!errorMessage && {
                        borderWidth: FIELD_SIZE.borderWidth,
                        borderColor: colors.borderError,
                      },
                    ],
              ]}
            >
              <AppText
                typographyType="body1"
                weight={isSelected ? "bold" : "regular"}
                color={
                  isSelected ? colors.textBrandPrimary : colors.textPrimary
                }
              >
                {t(option.labelKey)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </FieldShell>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: "row",
    gap: Spacing.s5,
  },
  // Equal-width boxes, same height and corners as other fields.
  option: {
    flex: 1,
    height: FIELD_SIZE.height,
    borderRadius: FIELD_SIZE.borderRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  unselected: {
    boxShadow: `0px 2px 4px 0px #CCDDE2`,
  },
  selected: {
    borderWidth: FIELD_SIZE.borderWidth,
    boxShadow: `0px 2px 4px 0px #CCDDE2`,
  },
});
