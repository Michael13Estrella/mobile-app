/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-14
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useState } from "react";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useTranslation } from "../../hooks/useTranslation";
import {
  FIELD_SIZE,
  resolveFieldColors,
  resolveFieldStatus,
} from "../../theme/field";
import {
  formatAmountInput,
  sanitizeAmountInput,
} from "../../utils/remittance/amountInput";
import { INTL_LOCALE } from "../../constants/locale";
import { StyleSheet, TextInput, View } from "react-native";
import { Spacing } from "../../constants/spacing";
import { TypographyTokens } from "../../constants/typography";
import { FieldLabel } from "./FieldLabel";
import { BrandCountryFlag } from "../icons";
import { CURRENCY_COUNTRY } from "../../constants/currency";
import { AppText } from "../common/AppText";
import { FieldHelperText } from "./FieldHelperText";

const FLAG_SIZE = 20;

type AppAmountInputProps = Readonly<{
  label: string;
  currency: string;
  // Clean amount string ("12000"), see utils/amountInput
  value: string;
  // Omit for a read-only field (e.g. a converted amount)
  onChangeValue?: (value: string) => void;
  // Decimals the user may type (0 = whole numbers, e.g. yen).
  fractionDigits?: number;
  placeholder?: string;
  hasFlag?: boolean;
  hint?: string;
}>;

// Amount with its currency: [flag] JPY 12,000. Shows grouping while typing
export function AppAmountInput({
  label,
  currency,
  value,
  onChangeValue,
  fractionDigits = 0,
  placeholder,
  hasFlag = false,
  hint,
}: AppAmountInputProps) {
  const { colors } = useAppTheme();
  const { locale } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  const fieldColors = resolveFieldColors(
    resolveFieldStatus({
      disabled: false,
      hasError: false,
      showSuccess: false,
      isFocused,
    }),
    colors,
  );
  const display = formatAmountInput(value, INTL_LOCALE[locale]);

  return (
    <View style={styles.container}>
      <FieldLabel label={label} />
      <View
        style={[
          styles.box,
          {
            borderColor: fieldColors.border,
            backgroundColor: fieldColors.background,
          },
        ]}
      >
        {hasFlag && (
          <BrandCountryFlag
            code={CURRENCY_COUNTRY[currency] ?? ""}
            size={FLAG_SIZE}
            shape="circle"
          />
        )}

        <AppText typographyType="body1" color={colors.textPrimary}>
          {currency}
        </AppText>

        {onChangeValue ? (
          <TextInput
            value={display}
            onChangeText={(text) =>
              onChangeValue(sanitizeAmountInput(text, fractionDigits))
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType={fractionDigits > 0 ? "decimal-pad" : "number-pad"}
            placeholder={placeholder}
            placeholderTextColor={fieldColors.placeholder}
            // Grouping commas move as you type; keep the cursor at the end
            selection={{ start: display.length, end: display.length }}
            accessibilityLabel={label}
            style={[styles.input, { color: fieldColors.text }]}
          />
        ) : (
          <AppText
            typographyType="body1"
            color={display ? fieldColors.text : fieldColors.placeholder}
            numberOfLines={1}
            style={styles.input}
          >
            {display || placeholder}
          </AppText>
        )}
      </View>
      <FieldHelperText hintText={hint} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: FIELD_SIZE.gap,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
    height: FIELD_SIZE.height,
    borderRadius: FIELD_SIZE.borderRadius,
    borderWidth: FIELD_SIZE.borderWidth,
    paddingHorizontal: FIELD_SIZE.paddingHorizontal,
  },
  input: {
    flex: 1,
    padding: 0,
    fontFamily: TypographyTokens.body1.fontFamily,
    fontSize: TypographyTokens.body1.fontSize,
  },
});
