import { ComponentProps } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { TextInput } from "react-native-paper";
import { Control, FieldValues, Path } from "react-hook-form";
import { Typography } from "../../constants/typography";
import { FIELD_SIZE } from "../../theme/field";
import { useFormField } from "../../hooks/useFormField";
import { BrandIconName } from "../icons";
import { FieldShell } from "./FieldShell";
import {
  FieldLeadingIcon,
  LEADING_ICON_CONTENT_PADDING,
} from "./FieldLeadingIcon";
import { normalizeSmartPunctuation } from "../../utils/normalizeText";

const LINE_HEIGHT = Typography.sizes.md * Typography.lineHeights.normal;

type AppInputProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  label?: string;
  labelHelper?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  successText?: string;
  leadingIcon?: BrandIconName;
  placeholder?: string;
  maxLength?: number;
  keyboardType?: ComponentProps<typeof TextInput>["keyboardType"];
  autoCapitalize?: ComponentProps<typeof TextInput>["autoCapitalize"];
  autoComplete?: ComponentProps<typeof TextInput>["autoComplete"];
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
}>;

export function AppInput<T extends FieldValues>({
  control,
  name,
  label,
  labelHelper,
  required = false,
  optional = false,
  hint,
  successText,
  leadingIcon,
  placeholder,
  maxLength,
  keyboardType = "default",
  autoCapitalize = "none",
  autoComplete,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
}: AppInputProps<T>) {
  const {
    value,
    onChange,
    onFocus,
    onBlur,
    errorMessage,
    showSuccess,
    fieldColors,
  } = useFormField({ control, name, disabled, successText });

  const handleChangeText = (text: string) => {
    // Smart quotes/dashes from the keyboard become plain ASCII ("’" -> "'").
    const normalized = normalizeSmartPunctuation(text);
    onChange(multiline ? normalized.replaceAll("\n", "") : normalized);
  };

  return (
    <FieldShell
      label={label}
      labelHelper={labelHelper}
      required={required}
      optional={optional}
      errorMessage={errorMessage}
      showSuccess={showSuccess}
      successText={successText}
      hint={hint}
    >
      <View style={styles.inputWrapper}>
        <TextInput
          value={value ?? ""}
          onChangeText={handleChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          disabled={disabled}
          // No `error` prop: Paper would override our outline with its own theme
          // error color. Error styling comes from fieldColors instead.
          multiline={multiline}
          numberOfLines={numberOfLines}
          mode="outlined"
          outlineColor={fieldColors.border}
          activeOutlineColor={fieldColors.border}
          textColor={fieldColors.text}
          placeholderTextColor={fieldColors.placeholder}
          outlineStyle={styles.outline}
          style={[
            styles.input,
            multiline && {
              height:
                numberOfLines * LINE_HEIGHT + FIELD_SIZE.paddingVertical * 2,
            },
            { backgroundColor: fieldColors.background },
          ]}
          contentStyle={[
            styles.content,
            multiline && styles.multilineContent,
            !!leadingIcon && { paddingLeft: LEADING_ICON_CONTENT_PADDING },
          ]}
        />

        <FieldLeadingIcon name={leadingIcon} color={fieldColors.icon} />
      </View>
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
  multilineContent: {
    paddingTop: FIELD_SIZE.paddingVertical,
    textAlignVertical: "top",
  },
});
