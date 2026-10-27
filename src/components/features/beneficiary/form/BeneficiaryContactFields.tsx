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
import { useFormContext, useWatch } from "react-hook-form";
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
import { RELATIONSHIP_OTHERS_CODE } from "../../../../constants/beneficiary";
import { useEffect } from "react";
import { AppInput } from "../../../form/AppInput";
import { FieldLimits } from "../../../../constants/fieldLimits";

type BeneficiaryContactFieldsProps = Readonly<{
  // "Mobile number" (individual) or "Company mobile number" (corporate)
  mobileLabel: string;
  // Own account: the relationship is always "Self"
  lockRelationship?: boolean;
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
  lockRelationship = false,
}: BeneficiaryContactFieldsProps) {
  const { t, locale } = useTranslation();
  const { colors } = useAppTheme();

  const { control, setValue, clearErrors } =
    useFormContext<BeneficiaryCommonValues>();

  const relationToBeneCode = useWatch({ control, name: "relationToBeneCode" });
  const isOthers = relationToBeneCode === RELATIONSHIP_OTHERS_CODE;

  // The typed relationship only counts with "Others": cleared otherwise
  useEffect(() => {
    if (isOthers) return;
    setValue("relationToBeneOthers", "");
    clearErrors("relationToBeneOthers");
  }, [isOthers, setValue, clearErrors]);

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
        fitContent
        disabled={lockRelationship}
      />

      {/* Relationship Others */}
      {isOthers && (
        <AppInput
          control={control}
          name="relationToBeneOthers"
          required
          placeholder={t("beneficiaryFields.relationshipOthers.placeholder")}
          maxLength={FieldLimits.relationToBeneOthers}
        />
      )}

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
