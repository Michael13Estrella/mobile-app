/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-23
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Control, FieldValues, Path } from "react-hook-form";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useFormField } from "../../hooks/useFormField";
import { FieldShell } from "./FieldShell";
import { StyleSheet, View } from "react-native";
import { FIELD_SIZE } from "../../theme/field";
import { MaskedDigitsInput } from "./MaskedDigitsInput";

type AppDigitsInputProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  // One "x" per digit, with the grouping in between (e.g. "xxx xxx xxx xxxx")
  template: string;
  label?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
}>;

/**
 * A digits-only form field shown in groups while typing (e.g. an account
 * number). The value is the digits alone
 *
 * @example <AppDigitsInput control={control} name="accountNo" template="xxx xxx xxx xxxx" label={t("…")} required />
 */
export function AppDigitsInput<T extends FieldValues>({
  control,
  name,
  template,
  label,
  required = false,
  optional = false,
  hint,
}: AppDigitsInputProps<T>) {
  const { colors } = useAppTheme();
  const { value, onChange, onFocus, onBlur, errorMessage, fieldColors } =
    useFormField({ control, name });

  return (
    <FieldShell
      label={label}
      required={required}
      optional={optional}
      errorMessage={errorMessage}
      hint={hint}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: fieldColors.background,
            borderColor: fieldColors.border,
          },
        ]}
      >
        <MaskedDigitsInput
          template={template}
          value={value ?? ""}
          onChangeDigits={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          textColor={fieldColors.text}
          placeholderColor={fieldColors.placeholder}
          cursorColor={colors.inputBorderFocused}
        />
      </View>
    </FieldShell>
  );
}

const styles = StyleSheet.create({
  box: {
    height: FIELD_SIZE.height,
    borderWidth: FIELD_SIZE.borderWidth,
    borderRadius: FIELD_SIZE.borderRadius,
    paddingHorizontal: FIELD_SIZE.paddingHorizontal,
    justifyContent: "center",
  },
});
