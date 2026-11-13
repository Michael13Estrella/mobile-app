/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { router } from "expo-router";
import { useTranslation } from "../../../hooks/useTranslation";
import { AppHeader } from "../../common/AppHeader";
import { AppScreen } from "../../common/AppScreen";
import { AppButton } from "../../common/AppButton";
import { FieldsContainer } from "../../form/FieldsContainer";
import {
  BeneficiaryPayout,
  BeneficiarySummary,
  RecentBeneficiary,
} from "../../../types";
import {
  buildSendMoneySchema,
  EMPTY_SEND_MONEY_FORM,
  SendMoneyAmountRules,
  SendMoneyFormInput,
  SendMoneyFormValues,
  SendMoneySubmission,
} from "../../../schemas/remittance/sendMoneySchema";
import { useManageBeneficiaries } from "../../../hooks/useManageBeneficiaries";
import { useAppSelector } from "../../../store";
import {
  getAllBeneficiaries,
  getBeneficiaryTitle,
} from "../../../utils/beneficiary/beneficiary";
import { useEffect, useMemo, useRef } from "react";
import { useController, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FORM_VALIDATION_MODE } from "../../../constants/form";
import { getErrorFieldLabels } from "../../../utils/form/formErrors";
import { FormErrorSummary } from "../../form/FormErrorSummary";
import { BeneficiarySelect } from "../beneficiary/BeneficiarySelect";
import { useBeneficiaryDetails } from "../../../hooks/useBeneficiaryDetails";
import { PayoutSelect } from "../beneficiary/PayoutSelect";
import { AppSelect } from "../../form/AppSelect";
import { toDropdownOptions } from "../../../utils/referenceData/referenceData";
import { useReferenceData } from "../../../hooks/useReferenceData";
import {
  PURPOSE_OTHERS_CODE,
  REMITTANCE_MINIMUMS,
  SOURCE_FUND_OTHERS_CODE,
} from "../../../constants/remittance";
import { AppInput } from "../../form/AppInput";
import { FieldLimits } from "../../../constants/fieldLimits";
import { FieldGroup } from "../../form/FieldGroup";
import { AppDivider } from "../../common/AppDivider";
import {
  CURRENCY_FRACTION_DIGITS,
  RECEIVE_CURRENCIES,
  ReceiveCurrency,
  WALLET_CURRENCY,
} from "../../../constants/currency";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useFormatMoney } from "../../../hooks/useFormatMoney";
import { useCharges } from "../../../hooks/useCharges";
import { RATE_SOURCE, useExchangeRates } from "../../../hooks/useExchangeRates";
import {
  getRemittancePayment,
  getRemittanceQuote,
} from "../../../utils/remittance/quote";
import { parseAmountInput } from "../../../utils/remittance/amountInput";
import { AppAmountInput } from "../../form/AppAmountInput";
import { AppText } from "../../common/AppText";
import { RemittanceSummaryCard } from "./RemittanceSummaryCard";
import { getPayoutCurrency } from "../../../utils/beneficiary/payout";
import { KeyboardAwareScrollViewRef } from "react-native-keyboard-controller";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../../constants/spacing";
import { findPairRate } from "../../../utils/remittance/exchangeRate";

// Stable empty lists while loading (a new [] each render would redo the
// drawer's sorting every time)
const NO_BENEFICIARIES: readonly BeneficiarySummary[] = [];
const NO_RECENT_BENEFICIARIES: readonly RecentBeneficiary[] = [];
const NO_PAYOUTS: readonly BeneficiaryPayout[] = [];

// Before the first render's rules are set: nothing known yet
const UNKNOWN_AMOUNT_RULES: SendMoneyAmountRules = {
  minimum: null,
  balance: null,
  totalPaymentOf: () => null,
  formatYen: String,
};

// Whether a currency is one Send Money can send to (has a minimum)
const isReceiveCurrency = (currency: string): currency is ReceiveCurrency =>
  (RECEIVE_CURRENCIES as readonly string[]).includes(currency);

type SendMoneyProps = Readonly<{
  // Preselects this beneficiary (opened from a beneficiary's screen)
  initialBeneficiaryGuid?: string;
  onSubmit: (submission: SendMoneySubmission) => void;
}>;

/**
 * The Send Money form: beneficiary, payout method, source of funds, purpose
 * and amount. Only collects and validates; the screen decides what happens next.
 *
 * @example <SendMoneyForm initialBeneficiaryGuid={beneficiaryGuid} onSubmit={handleSubmit} />
 */
export function SendMoneyForm({
  initialBeneficiaryGuid,
  onSubmit,
}: SendMoneyProps) {
  const { t, locale } = useTranslation();
  const { data: beneficiaryLists } = useManageBeneficiaries();
  // Saved by the dashboard's last load (Home)
  const recentBeneficiaries =
    useAppSelector((s) => s.dashboard.recentBeneficiaries) ??
    NO_RECENT_BENEFICIARIES;

  const beneficiaries = useMemo(
    () =>
      beneficiaryLists
        ? getAllBeneficiaries(beneficiaryLists)
        : NO_BENEFICIARIES,
    [beneficiaryLists],
  );

  const { colors } = useAppTheme();
  const formatMoney = useFormatMoney();
  // Saved by the dashboard's last load (Home)
  const wallet = useAppSelector((s) => s.dashboard.wallet);
  const { charges } = useCharges();
  // Real-time rates: this is an actual transfer
  const { rates } = useExchangeRates(RATE_SOURCE.LIVE);

  // Scrolls the breakdown into view when it appears
  const scrollRef = useRef<KeyboardAwareScrollViewRef>(null);

  // The amount rules depend on fields picked below; the schema reads the
  // latest ones each time it validates
  const amountRulesRef = useRef(UNKNOWN_AMOUNT_RULES);
  const schema = useMemo(
    () => buildSendMoneySchema(t, () => amountRulesRef.current),
    [t],
  );

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    trigger,
    formState: { isValid, errors },
  } = useForm<SendMoneyFormInput, unknown, SendMoneyFormValues>({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: {
      ...EMPTY_SEND_MONEY_FORM,
      beneficiaryGuid:
        initialBeneficiaryGuid ?? EMPTY_SEND_MONEY_FORM.beneficiaryGuid,
    },
  });

  // The picked "To", which decides whose payout methods are loaded
  const beneficiaryGuid = useWatch({ control, name: "beneficiaryGuid" });
  const selectedBeneficiary = beneficiaries.find(
    (beneficiary) => beneficiary.beneficiaryGuid === beneficiaryGuid,
  );

  const { data: details, isLoading: isPayoutLoading } =
    useBeneficiaryDetails(beneficiaryGuid);
  const payouts = details?.payouts ?? NO_PAYOUTS;

  // Reference master lists (cached after the first load)
  const { items: sourceFunds } = useReferenceData("sourceFund");
  const { items: purposes } = useReferenceData("purpose");

  const sourceFundCode = useWatch({ control, name: "sourceFundCode" });
  const purposeCode = useWatch({ control, name: "purposeCode" });
  const isSourceFundOthers = sourceFundCode === SOURCE_FUND_OTHERS_CODE;
  const isPurposeOthers = purposeCode === PURPOSE_OTHERS_CODE;

  // A type "Others" text only counts with "Others" picked: cleared otherwise
  useEffect(() => {
    if (isSourceFundOthers) return;
    setValue("sourceFundOthers", EMPTY_SEND_MONEY_FORM.sourceFundOthers);
    clearErrors("sourceFundOthers");
  }, [isSourceFundOthers, setValue, clearErrors]);

  useEffect(() => {
    if (isPurposeOthers) return;
    setValue("purposeOthers", EMPTY_SEND_MONEY_FORM.purposeOthers);
    clearErrors("purposeOthers");
  }, [isPurposeOthers, setValue, clearErrors]);

  // A preselected beneficiary that isn't saved anymore (e.g. deleted since)
  // would be a value the user can't see: start over with nothing picked
  useEffect(() => {
    if (!beneficiaryLists) return;
    const beneficiaryGuid = getValues("beneficiaryGuid");
    const isSaved = beneficiaries.some(
      (beneficiary) => beneficiary.beneficiaryGuid === beneficiaryGuid,
    );
    if (!beneficiaryGuid || isSaved) return;
    setValue("beneficiaryGuid", EMPTY_SEND_MONEY_FORM.beneficiaryGuid);
  }, [beneficiaryLists, beneficiaries, getValues, setValue]);

  // Keeps the payout in step with "To": a payout that isn't the current
  // beneficiary's (they changed "To") is cleared, and a beneficiary with only
  // one payout method gets it picked
  useEffect(() => {
    const payoutId = getValues("payoutId");
    if (payouts.some((payout) => payout.payoutId === payoutId)) return;

    const [onlyPayout] = payouts.length === 1 ? payouts : [];
    if (onlyPayout) {
      setValue("payoutId", onlyPayout.payoutId, { shouldValidate: true });
      return;
    }
    if (payoutId !== EMPTY_SEND_MONEY_FORM.payoutId) {
      setValue("payoutId", EMPTY_SEND_MONEY_FORM.payoutId);
    }
  }, [payouts, getValues, setValue]);

  // The picked payout's currency is what the beneficiary receives
  const payoutId = useWatch({ control, name: "payoutId" });
  const selectedPayout = payouts.find((payout) => payout.payoutId === payoutId);
  const payoutCurrency = selectedPayout && getPayoutCurrency(selectedPayout);
  const receiveCurrency =
    payoutCurrency && isReceiveCurrency(payoutCurrency) ? payoutCurrency : null;

  const amountRules = useMemo<SendMoneyAmountRules>(
    () => ({
      minimum: receiveCurrency
        ? REMITTANCE_MINIMUMS[receiveCurrency].send
        : null,
      balance: wallet?.currentBalance ?? null,
      totalPaymentOf: (amount) =>
        getRemittancePayment(amount, charges)?.totalPayment ?? null,
      formatYen: (amount) => formatMoney(amount, WALLET_CURRENCY),
    }),
    [receiveCurrency, wallet, charges, formatMoney],
  );

  // A valid form always has both picked (the schema requires them); the
  // check only narrows the types
  const submit = (form: SendMoneyFormValues) => {
    if (!selectedBeneficiary || !selectedPayout) return;
    onSubmit({
      form,
      beneficiary: selectedBeneficiary,
      payout: selectedPayout,
      // The rate the breakdown just showed
      quotedRate:
        findPairRate(
          rates,
          WALLET_CURRENCY,
          getPayoutCurrency(selectedPayout),
        ) ?? null,
    });
  };

  // New rules (a payout picked, the charges loaded) re-check a typed amount
  useEffect(() => {
    amountRulesRef.current = amountRules;
    if (getValues("amount")) void trigger("amount");
  }, [amountRules, getValues, trigger]);

  const {
    field: amountField,
    fieldState: { error: amountError },
  } = useController({ control, name: "amount" });

  const quote = receiveCurrency
    ? getRemittanceQuote(
        parseAmountInput(amountField.value),
        receiveCurrency,
        rates,
        charges,
      )
    : null;

  const errorFields = getErrorFieldLabels(errors, {
    beneficiaryGuid: t("sendMoneyFields.beneficiary.label"),
    payoutId: t("sendMoneyFields.payout.label"),
    sourceFundCode: t("sendMoneyFields.sourceFund.label"),
    purposeCode: t("sendMoneyFields.purpose.label"),
    sourceFundOthers: t("sendMoneyFields.sourceFund.label"),
    purposeOthers: t("sendMoneyFields.purpose.label"),
    amount: t("sendMoneyFields.amount.label"),
  });

  return (
    <AppScreen
      gradient
      scrollRef={scrollRef}
      header={
        <AppHeader title={t("sendMoney.title")} onBack={() => router.back()} />
      }
      footer={
        <>
          <FormErrorSummary fields={errorFields} />

          <AppButton
            label={t("common.next")}
            variant="gradient"
            disabled={!isValid}
            onPress={handleSubmit(submit)}
          />
        </>
      }
    >
      <FieldsContainer>
        {/* To: the beneficiary picker (most recent, then everyone else) */}
        <BeneficiarySelect
          control={control}
          name="beneficiaryGuid"
          label={t("sendMoneyFields.beneficiary.label")}
          placeholder={t("sendMoneyFields.beneficiary.placeholder")}
          beneficiaries={beneficiaries}
          recentBeneficiaries={recentBeneficiaries}
        />

        {/* Payout method: the picked beneficiary's saved ones; locked until
            "To" is picked and its payouts are loaded */}
        <PayoutSelect
          control={control}
          name="payoutId"
          label={t("sendMoneyFields.payout.label")}
          placeholder={t("sendMoneyFields.payout.placeholder")}
          disabled={!selectedBeneficiary || isPayoutLoading}
          beneficiaryName={
            selectedBeneficiary ? getBeneficiaryTitle(selectedBeneficiary) : ""
          }
          payouts={payouts}
        />

        <AppDivider />

        {/* Source of funds */}
        <FieldGroup>
          <AppSelect
            control={control}
            name="sourceFundCode"
            label={t("sendMoneyFields.sourceFund.label")}
            placeholder={t("sendMoneyFields.sourceFund.placeholder")}
            options={toDropdownOptions(sourceFunds, locale)}
            fitContent
          />

          {isSourceFundOthers && (
            <AppInput
              control={control}
              name="sourceFundOthers"
              placeholder={t("sendMoneyFields.sourceFundOthers.placeholder")}
              maxLength={FieldLimits.sourceFundOthers}
            />
          )}
        </FieldGroup>

        {/* Purpose */}
        <FieldGroup>
          <AppSelect
            control={control}
            name="purposeCode"
            label={t("sendMoneyFields.purpose.label")}
            placeholder={t("sendMoneyFields.purpose.placeholder")}
            options={toDropdownOptions(purposes, locale)}
            fitContent
          />

          {isPurposeOthers && (
            <AppInput
              control={control}
              name="purposeOthers"
              placeholder={t("sendMoneyFields.purposeOthers.placeholder")}
              maxLength={FieldLimits.purposeOthers}
            />
          )}
        </FieldGroup>

        <AppDivider />

        {/* Remittance amount (JPY), with the available balance under it */}
        <FieldGroup>
          <AppAmountInput
            label={t("sendMoneyFields.amount.label")}
            currency={WALLET_CURRENCY}
            value={amountField.value}
            onChangeValue={amountField.onChange}
            onBlur={amountField.onBlur}
            fractionDigits={CURRENCY_FRACTION_DIGITS[WALLET_CURRENCY]}
            placeholder={t("sendMoneyFields.amount.placeholder")}
            errorMessage={amountError?.message}
            hasFlag
          />
          {wallet && (
            <AppText typographyType="body4" color={colors.textTertiary}>
              {t("sendMoneyFields.amount.availableBalance", {
                amount: formatMoney(wallet.currentBalance, WALLET_CURRENCY),
              })}
            </AppText>
          )}
        </FieldGroup>

        {/* The breakdown, once the amount is valid and a payout is picked */}
        {quote && receiveCurrency && !amountError && (
          <View
            style={styles.summary}
            // It's the end of the form: show all of it once it's laid out
            onLayout={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            <RemittanceSummaryCard
              quote={quote}
              receiveCurrency={receiveCurrency}
              rates={rates}
            />
            <AppText typographyType="body4" color={colors.textTertiary}>
              {t("sendMoney.summary.disclaimer")}
            </AppText>
          </View>
        )}
      </FieldsContainer>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  // The card and its disclaimer, spaced like the form's fields
  summary: {
    gap: Spacing.s5,
  },
});
