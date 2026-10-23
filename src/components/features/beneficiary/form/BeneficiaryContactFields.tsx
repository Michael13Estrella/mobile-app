/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-22
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { useFormContext } from "react-hook-form";
import { BENEFICIARY_PHONE_COUNTRY } from "../../../../constants/phone";
import { Spacing } from "../../../../constants/spacing";
import { useAppTheme } from "../../../../hooks/useAppTheme";
import { useReferenceData } from "../../../../hooks/useReferenceData";
import { useTranslation } from "../../../../hooks/useTranslation";
import { toDropdownOptions } from "../../../../utils/referenceData/referenceData";
import { AppText } from "../../../common/AppText";
import { AppPhoneInput } from "../../../form/AppPhoneInput";
import { AppSelect } from "../../../form/AppSelect";
import { BeneficiaryCommonValues } from "../../../../schemas/beneficiary/beneficiaryCommonSchema";

type BeneficiaryContactFieldsProps = Readonly<{
  // "Mobile number" (individual) or "Company mobile number" (corporate)
  mobileLabel: string;
}>;

/**
 * The last part of both beneficiary forms: relationship, then the
 * notification details (mobile number). Must be inside the form's
 * FormProvider.
 *
 * @example <BeneficiaryContactFields mobileLabel={t("beneficiaryFields.mobileNo.label")} />
 */
export function BeneficiaryContactFields({
  mobileLabel,
}: BeneficiaryContactFieldsProps) {
  const { t, locale } = useTranslation();
  const { colors } = useAppTheme();
  const { control } = useFormContext<BeneficiaryCommonValues>();

  // Relationships from the reference master (cached after the first load)
  const { items: relationships } = useReferenceData("relationWithBene");

  return (
    <>
      {/* Relationship */}
      <AppSelect
        control={control}
        name="relationToBeneCode"
        required
        label={t("beneficiaryFields.relationship.label")}
        placeholder={t("beneficiaryFields.relationship.placeholder")}
        options={toDropdownOptions(relationships, locale)}
      />

      {/* Notification details */}
      <View style={styles.sectionTitle}>
        <AppText
          typographyType="overline1"
          weight="bold"
          color={colors.textSecondary}
          style={styles.uppercase}
        >
          {t("addBeneficiary.notificationSection.title")}
        </AppText>
        <AppText typographyType="body4" color={colors.textSecondary}>
          {t("addBeneficiary.notificationSection.description")}
        </AppText>
      </View>

      {/* Mobile number */}
      <AppPhoneInput
        control={control}
        name="mobileNo"
        country={BENEFICIARY_PHONE_COUNTRY}
        optional
        label={mobileLabel}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    gap: Spacing.s2,
  },
  // Uppercase by style, so the translations stay normal text
  uppercase: {
    textTransform: "uppercase",
  },
});
