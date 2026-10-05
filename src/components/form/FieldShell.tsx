import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { FIELD_SIZE } from "../../theme/field";
import { FieldLabel } from "./FieldLabel";
import { FieldHelperText } from "./FieldHelperText";

type FieldShellProps = Readonly<{
  // Label row
  label?: string;
  labelHelper?: string;
  required?: boolean;
  optional?: boolean;
  // Helper row (error > success > info, see FieldHelperText)
  errorMessage?: string;
  showSuccess?: boolean;
  successText?: string;
  hint?: string;
  // For fields that show their own feedback below the input instead
  // (e.g. the password requirements checklist).
  hideHelperText?: boolean;
  // The input itself
  children: ReactNode;
}>;

// Shared layout for every form field: label, then the input, then the
// helper text, with the same spacing everywhere. Input components render
// only their own input part inside it.
export function FieldShell({
  label,
  labelHelper,
  required = false,
  optional = false,
  errorMessage,
  showSuccess = false,
  successText,
  hint,
  hideHelperText = false,
  children,
}: FieldShellProps) {
  return (
    <View style={styles.container}>
      <FieldLabel
        label={label}
        labelHelper={labelHelper}
        required={required}
        optional={optional}
      />

      {children}

      {!hideHelperText && (
        <FieldHelperText
          errorMessage={errorMessage}
          showSuccess={showSuccess}
          successText={successText}
          hintText={hint}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: FIELD_SIZE.gap,
  },
});
