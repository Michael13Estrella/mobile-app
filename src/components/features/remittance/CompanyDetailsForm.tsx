/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-10
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useMemo } from "react";
import { useFormatMoney } from "../../../hooks/useFormatMoney";
import { useTranslation } from "../../../hooks/useTranslation";
import {
  buildCompanyDetailsSchema,
  CompanyDetailsFormValues,
  EMPTY_COMPANY_DETAILS_FORM,
} from "../../../schemas/remittance/companyDetailsSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FORM_VALIDATION_MODE } from "../../../constants/form";
import { getErrorFieldLabels } from "../../../utils/form/formErrors";
import { AppScreen } from "../../common/AppScreen";
import { AppHeader } from "../../common/AppHeader";
import { router } from "expo-router";
import { FormErrorSummary } from "../../form/FormErrorSummary";
import { AppButton } from "../../common/AppButton";
import { FieldsContainer } from "../../form/FieldsContainer";
import { AppAlert } from "../../common/AppAlert";
import { COMPANY_DETAILS_MIN_AMOUNT } from "../../../constants/remittance";
import { WALLET_CURRENCY } from "../../../constants/currency";
import { AppInput } from "../../form/AppInput";
import { FieldLimits } from "../../../constants/fieldLimits";
import { AppPhoneInput } from "../../form/AppPhoneInput";
import { COMPANY_PHONE_COUNTRY } from "../../../constants/phone";

type CompanyDetailsProps = Readonly<{
  // Coming back from Review: what was entered before
  initialValues?: CompanyDetailsFormValues;
  onSubmit: (values: CompanyDetailsFormValues) => void;
}>;

/**
 * Send Money's "Additional Details": the remitter's company address and
 * telephone number, asked for from COMPANY_DETAILS_MIN_AMOUNT. Only collects
 * and validates; the screen decides what happens next.
 *
 * @example <CompanyDetailsForm initialValues={saved} onSubmit={handleSubmit} />
 */
export function CompanyDetailsForm({
  initialValues,
  onSubmit,
}: CompanyDetailsProps) {
  const { t } = useTranslation();
  const formatMoney = useFormatMoney();

  const schema = useMemo(() => buildCompanyDetailsSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<CompanyDetailsFormValues>({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: initialValues ?? EMPTY_COMPANY_DETAILS_FORM,
  });

  const errorFields = getErrorFieldLabels(errors, {
    companyAddress: t("sendMoneyFields.companyAddress.label"),
    companyTelNo: t("sendMoneyFields.companyTelNo.label"),
  });

  return (
    <AppScreen
      gradient
      header={
        <AppHeader
          title={t("sendMoney.companyDetails.title")}
          onBack={() => router.back()}
        />
      }
      footer={
        <>
          <FormErrorSummary fields={errorFields} />

          <AppButton
            label={t("common.next")}
            variant="gradient"
            disabled={!isValid}
            onPress={handleSubmit(onSubmit)}
          />
        </>
      }
    >
      <FieldsContainer>
        <AppAlert
          variant="info"
          message={t("sendMoney.companyDetails.notice", {
            amount: formatMoney(COMPANY_DETAILS_MIN_AMOUNT, WALLET_CURRENCY),
          })}
        />

        {/* Company address */}
        <AppInput
          control={control}
          name="companyAddress"
          required
          label={t("sendMoneyFields.companyAddress.label")}
          placeholder={t("sendMoneyFields.companyAddress.placeholder")}
          maxLength={FieldLimits.companyAddress}
          autoCapitalize="words"
        />

        {/* Company telephone number */}
        <AppPhoneInput
          control={control}
          name="companyTelNo"
          country={COMPANY_PHONE_COUNTRY}
          required
          label={t("sendMoneyFields.companyTelNo.label")}
        />
      </FieldsContainer>
    </AppScreen>
  );
}
