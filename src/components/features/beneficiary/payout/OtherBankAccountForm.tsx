/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-27
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useEffect, useMemo, useRef } from "react";
import { useOtherBanks } from "../../../../hooks/useOtherBanks";
import { useTranslation } from "../../../../hooks/useTranslation";
import {
  buildOtherBankAccountSchema,
  EMPTY_OTHER_BANK_ACCOUNT_FORM,
  OtherBankAccountFormValues,
} from "../../../../schemas/payout/otherBankAccountSchema";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FORM_VALIDATION_MODE } from "../../../../constants/form";
import { isEWalletBankCode } from "../../../../utils/beneficiary/payout";
import { toCodeNameOptions } from "../../../../utils/referenceData/referenceData";
import { getErrorFieldLabels } from "../../../../utils/form/formErrors";
import { AppScreen } from "../../../common/AppScreen";
import { AppHeader } from "../../../common/AppHeader";
import { router } from "expo-router";
import { FormErrorSummary } from "../../../form/FormErrorSummary";
import { AppButton } from "../../../common/AppButton";
import { FieldsContainer } from "../../../form/FieldsContainer";
import { AppSelect } from "../../../form/AppSelect";
import {
  E_WALLET_BANK_CODES,
  OTHER_BANK_CURRENCIES,
  PAYOUT_BRANCH_MAX_LENGTH,
} from "../../../../constants/payout";
import { AppPhoneInput } from "../../../form/AppPhoneInput";
import { BENEFICIARY_PHONE_COUNTRY } from "../../../../constants/phone";
import { AppInput } from "../../../form/AppInput";
import { AppCurrencySelect } from "../../../form/AppCurrencySelect";

type OtherBankAccountFormProps = Readonly<{
  // "Add Beneficiary" | "Add Payout Method"
  title: string;
  submitLabel: string;
  isSubmitting?: boolean;
  // bankName: the picked bank's name, for the screens after this one
  onSubmit: (values: OtherBankAccountFormValues, bankName: string) => void;
}>;

/**
 * The other bank / e-wallet payout form: bank, account number, currency and
 * branch. For an e-wallet (GCash, Maya), the account number is its +63
 * mobile number, with no currency or branch.
 * Only collects and validates; the screen decides what happens next.
 *
 * @example <OtherBankAccountForm title={t("addBeneficiary.title")} submitLabel={t("common.next")} onSubmit={handleSubmit} />
 */
export function OtherBankAccountForm({
  title,
  submitLabel,
  isSubmitting = false,
  onSubmit,
}: OtherBankAccountFormProps) {
  const { t } = useTranslation();
  const { otherBanks } = useOtherBanks();

  const schema = useMemo(() => buildOtherBankAccountSchema(t), [t]);

  const {
    control,
    handleSubmit,
    resetField,
    formState: { isValid, errors },
  } = useForm<OtherBankAccountFormValues>({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: EMPTY_OTHER_BANK_ACCOUNT_FORM,
  });

  const bankCode = useWatch({ control, name: "bankCode" });
  const isEWallet = isEWalletBankCode(bankCode);

  // A bank account number isn't a mobile number (and back), so switching
  // between a bank and an e-wallet starts the account number over
  const wasEWallet = useRef(isEWallet);
  useEffect(() => {
    if (wasEWallet.current === isEWallet) return;
    wasEWallet.current = isEWallet;
    resetField("accountNo");
  }, [isEWallet, resetField]);

  const bankOptions = useMemo(
    () => toCodeNameOptions(otherBanks),
    [otherBanks],
  );

  const submit = (values: OtherBankAccountFormValues) => {
    const bankName =
      otherBanks.find((bank) => bank.code === values.bankCode)?.name ?? "";
    onSubmit(values, bankName);
  };

  const errorFields = getErrorFieldLabels(errors, {
    bankCode: t("payoutFields.bankName.label"),
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
            onPress={handleSubmit(submit)}
          />
        </>
      }
    >
      <FieldsContainer>
        {/* Bank name: e-wallets first, then the banks A-Z */}
        <AppSelect
          control={control}
          name="bankCode"
          required
          label={t("payoutFields.bankName.label")}
          placeholder={t("payoutFields.bankName.placeholder")}
          options={bankOptions}
          pinnedValues={E_WALLET_BANK_CODES}
          groupByLetter
          sortAscending
        />

        {/* Account number: an e-wallet's is its mobile number */}
        {isEWallet ? (
          <AppPhoneInput
            control={control}
            name="accountNo"
            country={BENEFICIARY_PHONE_COUNTRY}
            required
            label={t("payoutFields.accountNo.label")}
          />
        ) : (
          <AppInput
            control={control}
            name="accountNo"
            required
            label={t("payoutFields.accountNo.label")}
            placeholder={t("payoutFields.accountNo.placeholder")}
            keyboardType="number-pad"
          />
        )}

        {/* Currency and branch: banks only */}
        {!isEWallet && (
          <>
            <AppCurrencySelect
              control={control}
              name="currency"
              required
              label={t("payoutFields.currency.label")}
              currencies={OTHER_BANK_CURRENCIES}
            />

            <AppInput
              control={control}
              name="branchName"
              required
              label={t("payoutFields.branch.label")}
              placeholder={t("payoutFields.branch.placeholder")}
              maxLength={PAYOUT_BRANCH_MAX_LENGTH}
              autoCapitalize="words"
            />
          </>
        )}
      </FieldsContainer>
    </AppScreen>
  );
}
