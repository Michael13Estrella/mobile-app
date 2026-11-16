/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Control, FieldValues, Path } from "react-hook-form";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Contact } from "expo-contacts";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useFormField } from "../../hooks/useFormField";
import { useTranslation } from "../../hooks/useTranslation";
import { FIELD_SIZE } from "../../theme/field";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import {
  PHONE_COUNTRIES,
  PHONE_COUNTRY_NAME_KEYS,
  PhoneCountry,
  PhoneCountryCode,
} from "../../constants/phone";
import { toPhoneDigits } from "../../utils/format/phone";
import { BrandCountryFlag, BrandIcon } from "../icons";
import { FieldShell } from "./FieldShell";
import { MaskedDigitsInput } from "./MaskedDigitsInput";
import { useState } from "react";
import { DropdownOption } from "../../utils/referenceData/referenceData";
import { SelectSheet } from "./select/SelectSheet";

const FLAG_SIZE = 16;
const CONTACT_ICON_SIZE = 16;
const CHEVRON_SIZE = 16;

type AppPhoneInputProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  // The current country: REMITTER_PHONE_COUNTRY (+81), BENEFICIARY_PHONE_COUNTRY
  // (+63), or the one picked from `countries`
  country: PhoneCountry;
  // Countries the user can switch between: the flag + dial code opens a
  // picker. Without it, `country` is fixed
  countries?: readonly PhoneCountryCode[];
  onCountryChange?: (code: PhoneCountryCode) => void;
  label?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
}>;

function ContactIcon({ color }: Readonly<{ color: string }>) {
  return (
    <BrandIcon name="phoneBook1Solid" size={CONTACT_ICON_SIZE} color={color} />
  );
}

export function AppPhoneInput<T extends FieldValues>({
  control,
  name,
  country,
  countries,
  onCountryChange,
  label,
  required = false,
  optional = false,
  hint,
}: AppPhoneInputProps<T>) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const { value, onChange, onFocus, onBlur, errorMessage, fieldColors } =
    useFormField({ control, name });

  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const canChangeCountry = !!countries && countries.length > 1;

  const countryOptions: DropdownOption[] = (countries ?? []).map((code) => ({
    value: code,
    label: t("phone.countryOption", {
      country: t(PHONE_COUNTRY_NAME_KEYS[code]),
      dialCode: PHONE_COUNTRIES[code].dialCode,
    }),
    isoAlpha2: PHONE_COUNTRIES[code].isoAlpha2,
  }));

  const handleCountrySelect = (option: DropdownOption) => {
    setIsCountryPickerOpen(false);
    const code = countries?.find((item) => item === option.value);
    if (!code || code === country.isoAlpha2) return;
    // Another country's number has another digit count: start over
    onChange("");
    onCountryChange?.(code);
  };

  const handlePickContact = () => {
    Alert.alert(
      t("permissions.contact.title"),
      t("permissions.contact.message"),
      [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("common.ok"), onPress: openContactPicker },
      ],
    );
  };

  const openContactPicker = async () => {
    try {
      const contact = await Contact.presentPicker();
      if (!contact) return;

      const phones = await contact.getPhones();
      const phoneNumber = phones[0]?.number;
      if (!phoneNumber) return;

      onChange(toPhoneDigits(country, phoneNumber));
      // A picked number never went through the input, so validate it now.
      onBlur();
    } catch {
      // User cancelled or permission denied — nothing to recover from here.
    }
  };

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
          styles.fieldWrapper,
          {
            backgroundColor: fieldColors.background,
            borderColor: fieldColors.border,
          },
        ]}
      >
        {/* Flag + dial code; a button to the country picker when there's a choice */}
        <Pressable
          style={styles.country}
          onPress={() => setIsCountryPickerOpen(true)}
          disabled={!canChangeCountry}
          hitSlop={Spacing.s3}
          accessibilityRole={canChangeCountry ? "button" : undefined}
          accessibilityLabel={t("phone.countryCode")}
        >
          <BrandCountryFlag
            code={country.isoAlpha2}
            size={FLAG_SIZE}
            shape="square"
          />
          <Text style={[styles.dialCode, { color: fieldColors.text }]}>
            +{country.dialCode}
          </Text>
          {canChangeCountry && (
            <BrandIcon
              name="chevronSingleDownLine"
              size={CHEVRON_SIZE}
              color={colors.iconBrandPrimary}
            />
          )}
        </Pressable>

        <MaskedDigitsInput
          template={country.template}
          value={value ?? ""}
          onChangeDigits={onChange}
          sanitize={(text) => toPhoneDigits(country, text)}
          onFocus={onFocus}
          onBlur={onBlur}
          textColor={fieldColors.text}
          placeholderColor={fieldColors.placeholder}
          cursorColor={colors.inputBorderFocused}
        />

        <Pressable
          style={styles.contactButton}
          onPress={handlePickContact}
          hitSlop={Spacing.s3}
          accessibilityRole="button"
        >
          <ContactIcon color={colors.iconBrandPrimary} />
        </Pressable>
      </View>

      {canChangeCountry && (
        <SelectSheet
          visible={isCountryPickerOpen}
          title={t("phone.countryCode")}
          options={countryOptions}
          selectedValue={country.isoAlpha2}
          onSelect={handleCountrySelect}
          onClear={() => setIsCountryPickerOpen(false)}
          onClose={() => setIsCountryPickerOpen(false)}
          showFlags
          fitContent
        />
      )}
    </FieldShell>
  );
}

const styles = StyleSheet.create({
  fieldWrapper: {
    height: FIELD_SIZE.height,
    borderWidth: FIELD_SIZE.borderWidth,
    borderRadius: FIELD_SIZE.borderRadius,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: FIELD_SIZE.paddingHorizontal,
    gap: Spacing.s4,
  },
  country: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s4,
  },
  dialCode: {
    fontSize: Typography.sizes.md,
  },
  contactButton: {
    paddingLeft: Spacing.s3,
  },
});
