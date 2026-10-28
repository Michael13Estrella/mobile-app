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

import { ReactNode, useMemo } from "react";
import { useTranslation } from "../../../../hooks/useTranslation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FORM_VALIDATION_MODE } from "../../../../constants/form";
import { getErrorFieldLabels } from "../../../../utils/form/formErrors";
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
import { StyleSheet } from "react-native";
import { Spacing } from "../../../../constants/spacing";
import {
  buildIndividualBeneficiarySchema,
  EMPTY_INDIVIDUAL_FORM,
  IndividualFormValues,
} from "../../../../schemas/beneficiary/individualBeneficiarySchema";
import { getBeneficiaryCommonLabels } from "../../../../schemas/beneficiary/beneficiaryCommonSchema";
import { BeneficiaryAddressFields } from "./BeneficiaryAddressFields";
import { BeneficiaryContactFields } from "./BeneficiaryContactFields";

type IndividualBeneficiaryFormProps = Readonly<{
  // "Add Beneficiary" | "Edit Beneficiary"
  title: string;
  // "Next" (add) | "Save" (edit)
  submitLabel: string;
  // Edit: the saved details; own account: the remitter's profile
  initialValues?: Partial<IndividualFormValues>;
  // Fields that can't be changed (own account: birth date and relationship)
  lockFields?: readonly (keyof IndividualFormValues)[];
  // While saving: the button shows a spinner
  isSubmitting?: boolean;
  // Above the fields (Add: the category's avatar)
  avatar?: ReactNode;
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
  lockFields = [],
  isSubmitting = false,
  avatar,
  onSubmit,
}: IndividualBeneficiaryFormProps) {
  const { t } = useTranslation();

  const schema = useMemo(() => buildIndividualBeneficiarySchema(t), [t]);

  const methods = useForm<IndividualFormValues>({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: { ...EMPTY_INDIVIDUAL_FORM, ...initialValues },
  });
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = methods;

  const mobileLabel = t("beneficiaryFields.mobileNo.label");
  const errorFields = getErrorFieldLabels(errors, {
    beneAlias: t("beneficiaryFields.nickname.label"),
    lastName: t("beneficiaryFields.lastName.label"),
    firstName: t("beneficiaryFields.firstName.label"),
    middleName: t("beneficiaryFields.middleName.label"),
    gender: t("beneficiaryFields.gender.label"),
    birthDate: t("beneficiaryFields.dateOfBirth.label"),
    ...getBeneficiaryCommonLabels(t, mobileLabel),
  });

  return (
    <FormProvider {...methods}>
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
        {avatar}

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
            disabled={lockFields.includes("birthDate")}
          />

          <AppDivider />

          <BeneficiaryAddressFields
            placeholders={{
              addressLine1: t("beneficiaryFields.addressLine1.placeholder"),
              addressLine2: t("beneficiaryFields.addressLine2.placeholder"),
              province: t("beneficiaryFields.province.placeholder"),
              city: t("beneficiaryFields.city.placeholder"),
            }}
          />

          <AppDivider />

          {/* Notification details */}
          <BeneficiaryContactFields
            mobileLabel={mobileLabel}
            lockRelationship={lockFields.includes("relationToBeneCode")}
          />
        </FieldsContainer>
      </AppScreen>
    </FormProvider>
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
