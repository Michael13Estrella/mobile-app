import { ComponentProps, useCallback, useState } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { TextInput } from "react-native-paper";
import { Control, FieldValues, Path } from "react-hook-form";
import { Typography } from "../../constants/typography";
import { FIELD_SIZE } from "../../theme/field";
import { useFormField } from "../../hooks/useFormField";
import { BrandIcon, BrandIconName } from "../icons";
import { FieldShell } from "./FieldShell";
import { PasswordRequirementsChecklist } from "./PasswordRequirementsCheckList";
import {
  FieldLeadingIcon,
  LEADING_ICON_CONTENT_PADDING,
  LEADING_ICON_SIZE,
} from "./FieldLeadingIcon";

type AppPasswordInputProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  leadingIcon?: BrandIconName;
  placeholder?: string;
  autoComplete?: ComponentProps<typeof TextInput>["autoComplete"];
  disabled?: boolean;
  // Shows the live requirements checklist below the input (for creating a
  // password). Off for login, where the rules should not be revealed.
  showRequirements?: boolean;
  style?: ViewStyle;
}>;

export function AppPasswordInput<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  leadingIcon,
  placeholder,
  autoComplete,
  disabled = false,
  showRequirements = false,
}: AppPasswordInputProps<T>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const { value, onChange, onFocus, onBlur, fieldColors } = useFormField({
    control,
    name,
    disabled,
  });

  const renderPasswordIcon = useCallback(
    () => (
      <BrandIcon
        name={isPasswordVisible ? "eyeLine" : "eyeOffLine"}
        size={LEADING_ICON_SIZE}
        color={fieldColors.icon}
      />
    ),
    [isPasswordVisible, fieldColors.icon],
  );

  return (
    // The checklist replaces the helper text, so the helper row is hidden.
    <FieldShell label={label} required={required} hideHelperText>
      <View style={styles.inputWrapper}>
        <TextInput
          value={value ?? ""}
          onChangeText={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
          autoComplete={autoComplete}
          disabled={disabled}
          // No `error` prop: Paper would override our outline with its own theme
          // error color. Error styling comes from fieldColors instead.
          mode="outlined"
          outlineColor={fieldColors.border}
          activeOutlineColor={fieldColors.border}
          textColor={fieldColors.text}
          placeholderTextColor={fieldColors.placeholder}
          outlineStyle={styles.outline}
          style={[styles.input, { backgroundColor: fieldColors.background }]}
          contentStyle={[
            styles.content,
            !!leadingIcon && { paddingLeft: LEADING_ICON_CONTENT_PADDING },
          ]}
          right={
            <TextInput.Icon
              icon={renderPasswordIcon}
              onPress={() => setIsPasswordVisible((visible) => !visible)}
            />
          }
        />

        <FieldLeadingIcon name={leadingIcon} color={fieldColors.icon} />
      </View>

      {showRequirements && (
        <PasswordRequirementsChecklist password={value ?? ""} />
      )}
    </FieldShell>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    justifyContent: "center",
  },
  outline: {
    borderRadius: FIELD_SIZE.borderRadius,
    borderWidth: FIELD_SIZE.borderWidth,
  },
  input: {
    height: FIELD_SIZE.height,
  },
  content: {
    fontSize: Typography.sizes.md,
    paddingHorizontal: FIELD_SIZE.paddingHorizontal,
    paddingVertical: FIELD_SIZE.paddingVertical,
  },
});
