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

import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "../../../../hooks/useTranslation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FORM_VALIDATION_MODE } from "../../../../constants/form";
import { getErrorFieldLabels } from "../../../../utils/formErrors";
import { AppScreen } from "../../../common/AppScreen";
import { FieldsContainer } from "../../../form/FieldsContainer";
import { AppInput } from "../../../form/AppInput";
import { AppHeader } from "../../../common/AppHeader";
import { router } from "expo-router";
import { AppGenderSelect } from "../../../form/AppGenderSelect";
import { AppDivider } from "../../../common/AppDivider";
import { AppDateInput } from "../../../form/AppDateInput";
import { FormErrorSummary } from "../../../form/FormErrorSummary";
import { AppButton } from "../../../common/AppButton";
import { useReferenceData } from "../../../../hooks/useReferenceData";
import {
  toAreaOptions,
  toDropdownOptions,
} from "../../../../utils/referenceData";
import { AppSelect } from "../../../form/AppSelect";
import { AppPhoneInput } from "../../../form/AppPhoneInput";
import { BENEFICIARY_PHONE_COUNTRY } from "../../../../constants/phone";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../../../constants/spacing";
import { AppText } from "../../../common/AppText";
import { useAppTheme } from "../../../../hooks/useAppTheme";
import {
  buildIndividualBeneficiarySchema,
  EMPTY_INDIVIDUAL_FORM,
  IndividualFormValues,
} from "../../../../schemas/individualBeneficiarySchema";
import { usePhilippineAreas } from "../../../../hooks/usePhilippineArea";

type IndividualBeneficiaryFormProps = Readonly<{
  // "Add Beneficiary" | "Edit Beneficiary"
  title: string;
  // "Next" (add) | "Save" (edit)
  submitLabel: string;
  // Edit: the saved details; own account: the remitter's profile
  initialValues?: Partial<IndividualFormValues>;
  // While saving: the button shows a spinner
  isSubmitting?: boolean;
  onSubmit: (values: IndividualFormValues) => void;
}>;

/**
 * The Add Beneficiary form for a person (individual, and the remitter's own
 * account)
 *
 * @example <IndividualBeneficiaryForm />
 */
export function IndividualBeneficiaryForm({
  title,
  submitLabel,
  initialValues,
  isSubmitting = false,
  onSubmit,
}: IndividualBeneficiaryFormProps) {
  const { t, locale } = useTranslation();
  const { colors } = useAppTheme();

  const { items: relationships } = useReferenceData("relationWithBene");
  const relationshipOptions = toDropdownOptions(relationships, locale);

  const schema = useMemo(() => buildIndividualBeneficiarySchema(t), [t]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = useForm<IndividualFormValues>({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: { ...EMPTY_INDIVIDUAL_FORM, ...initialValues },
  });

  // City/Municipality depends on the province
  const cityProvCode = useWatch({ control, name: "cityProvCode" });
  const { provinces, towns } = usePhilippineAreas(cityProvCode);

  // A new province: the city picked for the old one no longer fits. (Not on
  // the first render, so an edit form keeps its saved city)
  const previousCityProvCode = useRef(cityProvCode);
  useEffect(() => {
    if (previousCityProvCode.current === cityProvCode) return;
    previousCityProvCode.current = cityProvCode;
    setValue("zipPosCode", "");
  }, [cityProvCode, setValue]);

  const errorFields = getErrorFieldLabels(errors, {
    beneAlias: t("beneficiaryFields.nickname.label"),
    lastName: t("beneficiaryFields.lastName.label"),
    firstName: t("beneficiaryFields.firstName.label"),
    middleName: t("beneficiaryFields.middleName.label"),
    gender: t("beneficiaryFields.gender.label"),
    birthDate: t("beneficiaryFields.dateOfBirth.label"),
    addressLine1: t("beneficiaryFields.addressLine1.label"),
    addressLine2: t("beneficiaryFields.addressLine2.label"),
    cityProvCode: t("beneficiaryFields.province.label"),
    zipPosCode: t("beneficiaryFields.city.label"),
    relationToBeneCode: t("beneficiaryFields.relationship.label"),
    mobileNo: t("beneficiaryFields.mobileNo.label"),
  });

  return (
    <AppScreen
      gradient
      header={<AppHeader title={title} onBack={() => router.back()} />}
      footer={
        <>
          <FormErrorSummary fields={errorFields} />

          <AppButton
            label={submitLabel}
            variant="gradient"
            disabled={!isValid}
            loading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </>
      }
    >
      <FieldsContainer>
        {/* Nickname */}
        <AppInput
          control={control}
          name="beneAlias"
          optional
          label={t("beneficiaryFields.nickname.label")}
          placeholder={t("beneficiaryFields.nickname.placeholder")}
          autoCapitalize="words"
        />

        {/* Last name */}
        <AppInput
          control={control}
          name="lastName"
          required
          label={t("beneficiaryFields.lastName.label")}
          placeholder={t("beneficiaryFields.lastName.placeholder")}
          autoCapitalize="words"
        />

        {/* First name */}
        <AppInput
          control={control}
          name="firstName"
          required
          label={t("beneficiaryFields.firstName.label")}
          placeholder={t("beneficiaryFields.firstName.placeholder")}
          autoCapitalize="words"
        />

        {/* Middle name */}
        <AppInput
          control={control}
          name="middleName"
          optional
          label={t("beneficiaryFields.middleName.label")}
          placeholder={t("beneficiaryFields.middleName.placeholder")}
          autoCapitalize="words"
        />

        <AppDivider />

        {/* Gender */}
        <AppGenderSelect
          control={control}
          name="gender"
          optional
          label={t("beneficiaryFields.gender.label")}
        />

        {/* Date of Birth */}
        <AppDateInput
          control={control}
          name="birthDate"
          optional
          leadingIcon="calendarLine"
          label={t("beneficiaryFields.dateOfBirth.label")}
        />

        <AppDivider />

        {/* Address line 1 */}
        <AppInput
          control={control}
          name="addressLine1"
          required
          label={t("beneficiaryFields.addressLine1.label")}
          placeholder={t("beneficiaryFields.addressLine1.placeholder")}
          autoCapitalize="words"
        />

        {/* Address line 2 */}
        <AppInput
          control={control}
          name="addressLine2"
          optional
          label={t("beneficiaryFields.addressLine2.label")}
          placeholder={t("beneficiaryFields.addressLine2.placeholder")}
          autoCapitalize="words"
        />

        {/* Province */}
        <AppSelect
          control={control}
          name="cityProvCode"
          required
          label={t("beneficiaryFields.province.label")}
          placeholder={t("beneficiaryFields.province.placeholder")}
          options={toAreaOptions(provinces)}
          groupByLetter
          sortAscending
        />

        {/* City/Municipality: the chosen province's */}
        <AppSelect
          control={control}
          name="zipPosCode"
          required
          label={t("beneficiaryFields.city.label")}
          placeholder={t("beneficiaryFields.city.placeholder")}
          options={toAreaOptions(towns)}
          groupByLetter
          sortAscending
        />

        <AppDivider />

        {/* Relationship with beneficiary */}
        <AppSelect
          control={control}
          name="relationToBeneCode"
          required
          label={t("beneficiaryFields.relationship.label")}
          placeholder={t("beneficiaryFields.relationship.placeholder")}
          options={relationshipOptions}
          fitContent
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
          <AppText typographyType="body4" color={colors.textTertiary}>
            {t("addBeneficiary.notificationSection.description")}
          </AppText>
        </View>

        {/* Mobile number */}
        <AppPhoneInput
          control={control}
          name="mobileNo"
          country={BENEFICIARY_PHONE_COUNTRY}
          optional
          label={t("beneficiaryFields.mobileNo.label")}
        />
      </FieldsContainer>
    </AppScreen>
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
