import { useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useFormField } from "../../hooks/useFormField";
import { useAppSelector } from "../../store";
import { FIELD_SIZE } from "../../theme/field";
import { BrandIcon, BrandIconName } from "../icons";
import { FieldShell } from "./FieldShell";
import { LEADING_ICON_GAP, LEADING_ICON_SIZE } from "./FieldLeadingIcon";
import { MaskedDigitsInput } from "./MaskedDigitsInput";

const DATE_DIGIT_COUNT = 8;
const EN_TEMPLATE = "MM / DD / YYYY";
const JA_TEMPLATE = "YYYY年 MM月 DD日";

type AppDateInputProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  successText?: string;
  leadingIcon?: BrandIconName;
}>;

const digitsToIsoEn = (digits: string): string => {
  if (digits.length < DATE_DIGIT_COUNT) return "";
  const month = digits.slice(0, 2);
  const day = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return `${year}-${month}-${day}`;
};

const digitsToIsoJa = (digits: string): string => {
  if (digits.length < DATE_DIGIT_COUNT) return "";
  const year = digits.slice(0, 4);
  const month = digits.slice(4, 6);
  const day = digits.slice(6, 8);
  return `${year}-${month}-${day}`;
};

const isoToDigitsEn = (iso: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return "";
  const [, year, month, day] = match;
  return `${month}${day}${year}`;
};

const isoToDigitsJa = (iso: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return "";
  const [, year, month, day] = match;
  return `${year}${month}${day}`;
};

export function AppDateInput<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  optional = false,
  hint,
  successText,
  leadingIcon,
}: AppDateInputProps<T>) {
  const { colors } = useAppTheme();
  const locale = useAppSelector((s) => s.ui.locale);
  const isJapanese = locale === "ja";

  const {
    value,
    onChange,
    onFocus,
    onBlur,
    errorMessage,
    showSuccess,
    fieldColors,
  } = useFormField({ control, name, successText });

  // Digits typed so far. The form only gets a value (ISO "YYYY-MM-DD") once
  // the date is complete, so partial input is kept here.
  const [digits, setDigits] = useState(() =>
    isJapanese ? isoToDigitsJa(value ?? "") : isoToDigitsEn(value ?? ""),
  );

  const template = isJapanese ? JA_TEMPLATE : EN_TEMPLATE;

  const handleChangeDigits = (nextDigits: string) => {
    setDigits(nextDigits);
    const toIso = isJapanese ? digitsToIsoJa : digitsToIsoEn;
    onChange(nextDigits.length === DATE_DIGIT_COUNT ? toIso(nextDigits) : "");
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
      <View
        style={[
          styles.box,
          {
            backgroundColor: fieldColors.background,
            borderColor: fieldColors.border,
          },
        ]}
      >
        {!!leadingIcon && (
          <BrandIcon
            name={leadingIcon}
            size={LEADING_ICON_SIZE}
            color={fieldColors.icon}
          />
        )}

        <MaskedDigitsInput
          template={template}
          value={digits}
          onChangeDigits={handleChangeDigits}
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: FIELD_SIZE.paddingHorizontal,
    // Same icon-to-text spacing as AppInput's leading icon.
    gap: LEADING_ICON_GAP,
  },
});
