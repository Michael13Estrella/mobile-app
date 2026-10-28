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
import { router } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldLimits } from "../../../../constants/fieldLimits";
import { FORM_VALIDATION_MODE } from "../../../../constants/form";
import { BENEFICIARY_PHONE_COUNTRY } from "../../../../constants/phone";
import { useTranslation } from "../../../../hooks/useTranslation";
import { getBeneficiaryCommonLabels } from "../../../../schemas/beneficiary/beneficiaryCommonSchema";
import {
  buildCorporateBeneficiarySchema,
  CorporateFormValues,
  EMPTY_CORPORATE_FORM,
} from "../../../../schemas/beneficiary/corporateBeneficiarySchema";
import { getErrorFieldLabels } from "../../../../utils/form/formErrors";
import { AppButton } from "../../../common/AppButton";
import { AppDivider } from "../../../common/AppDivider";
import { AppHeader } from "../../../common/AppHeader";
import { AppScreen } from "../../../common/AppScreen";
import { AppInput } from "../../../form/AppInput";
import { AppPhoneInput } from "../../../form/AppPhoneInput";
import { FieldsContainer } from "../../../form/FieldsContainer";
import { FormErrorSummary } from "../../../form/FormErrorSummary";
import { BeneficiaryAddressFields } from "./BeneficiaryAddressFields";
import { BeneficiaryContactFields } from "./BeneficiaryContactFields";

type CorporateBeneficiaryFormProps = Readonly<{
  // "Add Beneficiary" | "Edit Beneficiary"
  title: string;
  // "Next" (add) | "Save" (edit)
  submitLabel: string;
  // Edit: the saved details
  initialValues?: Partial<CorporateFormValues>;
  // While saving: the button shows a spinner
  isSubmitting?: boolean;
  // Above the fields (Add: the category's avatar)
  avatar?: ReactNode;
  onSubmit: (values: CorporateFormValues) => void;
}>;

/**
 * The beneficiary form for a company: company name and phone, address,
 * relationship and company mobile number. Only collects and validates; the
 * screen decides what happens with the values (add: payout step; edit: save).
 *
 * @example <CorporateBeneficiaryForm title={t("addBeneficiary.title")} submitLabel={t("common.next")} onSubmit={handleSubmit} />
 */
export function CorporateBeneficiaryForm({
  title,
  submitLabel,
  initialValues,
  isSubmitting = false,
  avatar,
  onSubmit,
}: CorporateBeneficiaryFormProps) {
  const { t } = useTranslation();

  const schema = useMemo(() => buildCorporateBeneficiarySchema(t), [t]);

  const methods = useForm<CorporateFormValues>({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: { ...EMPTY_CORPORATE_FORM, ...initialValues },
  });
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = methods;

  const mobileLabel = t("beneficiaryFields.mobileNo.label");
  const errorFields = getErrorFieldLabels(errors, {
    companyName: t("beneficiaryFields.companyName.label"),
    officeTelNo: t("beneficiaryFields.officeTelNo.label"),
    ...getBeneficiaryCommonLabels(t, mobileLabel),
  });

  return (
    // Lets the shared sections (address, contact) reach this form
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
          {/* Company name */}
          <AppInput
            control={control}
            name="companyName"
            required
            label={t("beneficiaryFields.companyName.label")}
            placeholder={t("beneficiaryFields.companyName.placeholder")}
            maxLength={FieldLimits.companyName}
            autoCapitalize="words"
          />

          {/* Company phone number */}
          <AppPhoneInput
            control={control}
            name="officeTelNo"
            country={BENEFICIARY_PHONE_COUNTRY}
            required
            label={t("beneficiaryFields.officeTelNo.label")}
          />

          <AppDivider />

          <BeneficiaryAddressFields
            placeholders={{
              addressLine1: t(
                "beneficiaryFields.addressLine1.companyPlaceholder",
              ),
              addressLine2: t(
                "beneficiaryFields.addressLine2.companyPlaceholder",
              ),
              province: t("beneficiaryFields.province.companyPlaceholder"),
              city: t("beneficiaryFields.city.companyPlaceholder"),
            }}
          />

          <AppDivider />

          <BeneficiaryContactFields mobileLabel={mobileLabel} />
        </FieldsContainer>
      </AppScreen>
    </FormProvider>
  );
}
