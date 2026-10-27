/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-23
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useMemo } from "react";
import { useTranslation } from "../../../../hooks/useTranslation";
import {
  buildMetrobankAccountSchema,
  EMPTY_METROBANK_ACCOUNT_FORM,
  MetrobankAccountFormValues,
} from "../../../../schemas/payout/metrobankAccountSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FORM_VALIDATION_MODE } from "../../../../constants/form";
import { getErrorFieldLabels } from "../../../../utils/form/formErrors";
import { AppScreen } from "../../../common/AppScreen";
import { AppHeader } from "../../../common/AppHeader";
import { router } from "expo-router";
import { FormErrorSummary } from "../../../form/FormErrorSummary";
import { AppButton } from "../../../common/AppButton";
import { FieldsContainer } from "../../../form/FieldsContainer";
import {
  METROBANK_ACCOUNT_CURRENCIES,
  METROBANK_ACCOUNT_NO_TEMPLATE,
  PAYOUT_BRANCH_MAX_LENGTH,
} from "../../../../constants/payout";
import { AppDigitsInput } from "../../../form/AppDigitsInput";
import { AppCurrencySelect } from "../../../form/AppCurrencySelect";
import { AppInput } from "../../../form/AppInput";

type MetrobankAccountFormProps = Readonly<{
  // "Add Beneficiary" | "Add Payout Method"
  title: string;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (values: MetrobankAccountFormValues) => void;
}>;

/**
 * The Metrobank account payout form: account number, currency and branch.
 * Only collects and validates; the screen decides what happens next.
 *
 * @example <MetrobankAccountForm title={t("addBeneficiary.title")} submitLabel={t("common.next")} onSubmit={handleSubmit} />
 */
export function MetrobankAccountForm({
  title,
  submitLabel,
  isSubmitting = false,
  onSubmit,
}: MetrobankAccountFormProps) {
  const { t } = useTranslation();

  const schema = useMemo(() => buildMetrobankAccountSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<MetrobankAccountFormValues>({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: EMPTY_METROBANK_ACCOUNT_FORM,
  });

  const errorFields = getErrorFieldLabels(errors, {
    accountNo: t("payoutFields.accountNo.label"),
    currency: t("payoutFields.currency.label"),
    branchName: t("payoutFields.branch.label"),
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
        {/* Account number */}
        <AppDigitsInput
          control={control}
          name="accountNo"
          template={METROBANK_ACCOUNT_NO_TEMPLATE}
          required
          label={t("payoutFields.accountNo.label")}
        />

        {/* Currency */}
        <AppCurrencySelect
          control={control}
          name="currency"
          required
          label={t("payoutFields.currency.label")}
          currencies={METROBANK_ACCOUNT_CURRENCIES}
        />

        {/* Branch */}
        <AppInput
          control={control}
          name="branchName"
          optional
          label={t("payoutFields.branch.label")}
          placeholder={t("payoutFields.branch.placeholder")}
          maxLength={PAYOUT_BRANCH_MAX_LENGTH}
          autoCapitalize="words"
        />
      </FieldsContainer>
    </AppScreen>
  );
}
