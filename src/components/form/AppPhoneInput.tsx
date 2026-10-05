import { Control, FieldValues, Path } from "react-hook-form";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import CountryFlag from "react-native-country-flag";
import { Contact } from "expo-contacts";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useFormField } from "../../hooks/useFormField";
import { useTranslation } from "../../hooks/useTranslation";
import { FIELD_SIZE } from "../../theme/field";
import { Typography } from "../../constants/typography";
import { Spacing } from "../../constants/spacing";
import { PhoneCountry } from "../../constants/phone";
import { toPhoneDigits } from "../../utils/phone";
import { BrandIcon } from "../icons";
import { FieldShell } from "./FieldShell";
import { MaskedDigitsInput } from "./MaskedDigitsInput";

const FLAG_SIZE = 16;
const FLAG_BOX_RADIUS = 4;
const CONTACT_ICON_SIZE = 16;

type AppPhoneInputProps<T extends FieldValues> = Readonly<{
  control: Control<T>;
  name: Path<T>;
  // Fixed country: REMITTER_PHONE_COUNTRY (+81) or BENEFICIARY_PHONE_COUNTRY (+63).
  country: PhoneCountry;
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
  label,
  required = false,
  optional = false,
  hint,
}: AppPhoneInputProps<T>) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const { value, onChange, onFocus, onBlur, errorMessage, fieldColors } =
    useFormField({ control, name });

  const handlePickContact = () => {
    Alert.alert(
      t("phoneInput.contactsPermissionTitle"),
      t("phoneInput.contactsPermissionMessage"),
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
        {/* Fixed country: flag + dial code */}
        <View style={[styles.flagBox, { borderColor: colors.borderDefault }]}>
          <CountryFlag isoCode={country.isoAlpha2} size={FLAG_SIZE} />
        </View>
        <Text style={[styles.dialCode, { color: fieldColors.text }]}>
          +{country.dialCode}
        </Text>

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
  flagBox: {
    borderWidth: FIELD_SIZE.borderWidth,
    borderRadius: FLAG_BOX_RADIUS,
    paddingHorizontal: Spacing.s1,
    paddingVertical: Spacing.s1,
  },
  dialCode: {
    fontSize: Typography.sizes.md,
  },
  contactButton: {
    paddingLeft: Spacing.s3,
  },
});
