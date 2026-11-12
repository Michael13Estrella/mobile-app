/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-11
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ReactNode } from "react";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../../constants/spacing";
import { useTranslation } from "../../../hooks/useTranslation";
import { useFormatMoney } from "../../../hooks/useFormatMoney";
import { RATE_SOURCE, useExchangeRates } from "../../../hooks/useExchangeRates";
import { useCharges } from "../../../hooks/useCharges";
import { parseAmountInput } from "../../../utils/remittance/amountInput";
import { SendMoneyFormValues } from "../../../schemas/remittance/sendMoneySchema";
import { BeneficiaryPayout, BeneficiarySummary } from "../../../types";
import { CompanyDetailsFormValues } from "../../../schemas/remittance/companyDetailsSchema";
import { getRemittanceQuote } from "../../../utils/remittance/quote";
import {
  formatMetrobankAccountNo,
  getPayoutBankName,
  getPayoutCurrency,
} from "../../../utils/beneficiary/payout";
import { findPairRate } from "../../../utils/remittance/exchangeRate";
import { CURRENCY_COUNTRY, WALLET_CURRENCY } from "../../../constants/currency";
import { PAYOUT_TYPE } from "../../../constants/payout";
import { AppScreen } from "../../common/AppScreen";
import { AppHeader } from "../../common/AppHeader";
import { router } from "expo-router";
import { AppButton } from "../../common/AppButton";
import { AppText } from "../../common/AppText";
import { BrandCountryFlag } from "../../icons";
import { AppDivider } from "../../common/AppDivider";
import { getBeneficiaryTitle } from "../../../utils/beneficiary/beneficiary";
import { formatPhoneNumber } from "../../../utils/format/phone";
import { COMPANY_PHONE_COUNTRY } from "../../../constants/phone";
import { useFormatRate } from "../../../hooks/useFormatRate";
import { SendMoneyConfirmationInput } from "../../../store/slices/sendMoneySlice";
import { useSendMoneyReasons } from "../../../hooks/useSendMoneyReasons";

const FLAG_SIZE = 16;

// "LABEL      value": the label in grey capitals, the value (and anything
// under it) in the right column, left-aligned
function ReviewRow({
  label,
  children,
}: Readonly<{ label: string; children: ReactNode }>) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.row}>
      <AppText
        typographyType="overline1"
        weight="bold"
        color={colors.textSecondary}
        style={styles.label}
      >
        {label}
      </AppText>
      <View style={styles.value}>{children}</View>
    </View>
  );
}

// A row's value, with a flag before it ("🇯🇵 JPY 520,000")
function FlagValue({
  currency,
  text,
}: Readonly<{ currency: string; text: string }>) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.flagValue}>
      <BrandCountryFlag
        code={CURRENCY_COUNTRY[currency] ?? ""}
        size={FLAG_SIZE}
        shape="circle"
      />
      <AppText typographyType="body2" color={colors.textPrimary}>
        {text}
      </AppText>
    </View>
  );
}

type SendMoneyReviewProps = Readonly<{
  form: SendMoneyFormValues;
  beneficiary: BeneficiarySummary;
  payout: BeneficiaryPayout;
  // Only for remittances that need them
  companyDetails: CompanyDetailsFormValues | null;
  // The wallet's available balance (JPY); null when unknown
  walletBalance: number | null;
  // With the quote and rate just shown (the live rate)
  onConfirm: (confirmation: SendMoneyConfirmationInput) => void;
}>;

/**
 * Send Money's "All Good?": everything entered, and the amounts worked out
 * again with the live rate, before the remitter confirms.
 *
 * @example <SendMoneyReview form={form} beneficiary={beneficiary} payout={payout} companyDetails={null} walletBalance={650_000} onConfirm={send} />
 */
export function SendMoneyReview({
  form,
  beneficiary,
  payout,
  companyDetails,
  walletBalance,
  onConfirm,
}: SendMoneyReviewProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const formatMoney = useFormatMoney();
  const formatRate = useFormatRate();

  // Loaded again here: Review shows the rate that will actually be used
  const { rates } = useExchangeRates(RATE_SOURCE.LIVE);
  const { charges } = useCharges();
  const { sourceFund, purpose } = useSendMoneyReasons(form);

  const amount = parseAmountInput(form.amount);
  const receiveCurrency = getPayoutCurrency(payout);
  const quote = getRemittanceQuote(amount, receiveCurrency, rates, charges);
  const pairRate = findPairRate(rates, WALLET_CURRENCY, receiveCurrency);

  const isMetrobank = payout.payoutType === PAYOUT_TYPE.METROBANK_ACCOUNT;
  const isCashPickup = payout.payoutType === PAYOUT_TYPE.CASH_PICKUP;

  return (
    <AppScreen
      gradient
      header={
        <AppHeader title={t("sendMoney.title")} onBack={() => router.back()} />
      }
      footer={
        <AppButton
          label={t("sendMoney.review.confirm")}
          variant="gradient"
          // Until the live rate and charges are in, there's nothing to confirm
          disabled={!quote}
          onPress={() => quote && onConfirm({ quote, rate: pairRate ?? null })}
        />
      }
    >
      <View style={styles.titles}>
        <AppText typographyType="h4" weight="bold" color={colors.textPrimary}>
          {t("sendMoney.review.title")}
        </AppText>
        <AppText typographyType="body2" color={colors.textSecondary}>
          {t("sendMoney.review.subtitle")}
        </AppText>
      </View>

      <View style={styles.rows}>
        {/* From: the wallet and its balance */}
        <ReviewRow label={t("sendMoney.review.from")}>
          <AppText typographyType="body2" color={colors.textPrimary}>
            {t("sendMoney.review.wallet", { currency: WALLET_CURRENCY })}
          </AppText>
          {walletBalance !== null && (
            <AppText
              typographyType="body3"
              weight="semibold"
              color={colors.textTertiary}
            >
              {formatMoney(walletBalance, WALLET_CURRENCY)}
            </AppText>
          )}
        </ReviewRow>

        <AppDivider marginVertical={false} />

        {/* To: the beneficiary, and the bank (or "Cash pick-up") */}
        <ReviewRow label={t("sendMoney.review.to")}>
          <AppText typographyType="body2" color={colors.textPrimary}>
            {getBeneficiaryTitle(beneficiary)}
          </AppText>
          <AppText
            typographyType="body3"
            weight="semibold"
            color={colors.textTertiary}
            style={styles.uppercase}
          >
            {getPayoutBankName(payout)}
          </AppText>
        </ReviewRow>
        {/* Cash pick-up: no account */}
        {!isCashPickup && (
          <ReviewRow label={t("sendMoney.review.accountNo")}>
            <AppText typographyType="body2" color={colors.textPrimary}>
              {isMetrobank
                ? formatMetrobankAccountNo(payout.accountNo)
                : payout.accountNo}
            </AppText>
          </ReviewRow>
        )}

        <AppDivider marginVertical={false} />

        <ReviewRow label={t("sendMoney.review.sourceFund")}>
          <AppText typographyType="body2" color={colors.textPrimary}>
            {sourceFund}
          </AppText>
        </ReviewRow>
        <ReviewRow label={t("sendMoney.review.purpose")}>
          <AppText typographyType="body2" color={colors.textPrimary}>
            {purpose}
          </AppText>
        </ReviewRow>

        {/* Additional Details: only when they were asked for */}
        {companyDetails && (
          <>
            <AppDivider marginVertical={false} />
            <ReviewRow label={t("sendMoney.review.companyAddress")}>
              <AppText typographyType="body2" color={colors.textPrimary}>
                {companyDetails.companyAddress}
              </AppText>
            </ReviewRow>
            <ReviewRow label={t("sendMoney.review.companyTelNo")}>
              <AppText typographyType="body2" color={colors.textPrimary}>
                {formatPhoneNumber(
                  COMPANY_PHONE_COUNTRY,
                  companyDetails.companyTelNo,
                )}
              </AppText>
            </ReviewRow>
          </>
        )}

        <AppDivider marginVertical={false} />

        {/* The amounts, worked out with the live rate */}
        <ReviewRow label={t("sendMoney.review.remittanceAmount")}>
          <FlagValue
            currency={WALLET_CURRENCY}
            text={formatMoney(amount, WALLET_CURRENCY)}
          />
        </ReviewRow>
        {quote && (
          <>
            {pairRate && (
              <ReviewRow label={t("sendMoney.summary.exchangeRate")}>
                <AppText typographyType="body2" color={colors.textPrimary}>
                  {formatRate(pairRate)}
                </AppText>
              </ReviewRow>
            )}
            {quote.liftingFee !== null && (
              <ReviewRow label={t("sendMoney.summary.liftingCharge")}>
                <AppText typographyType="body2" color={colors.textPrimary}>
                  {formatMoney(quote.liftingFee, WALLET_CURRENCY)}
                </AppText>
              </ReviewRow>
            )}
            <ReviewRow label={t("sendMoney.summary.remittanceCharge")}>
              <AppText typographyType="body2" color={colors.textPrimary}>
                {formatMoney(quote.charge, WALLET_CURRENCY)}
              </AppText>
            </ReviewRow>

            <ReviewRow label={t("sendMoney.summary.totalPayment")}>
              <FlagValue
                currency={WALLET_CURRENCY}
                text={formatMoney(quote.totalPayment, WALLET_CURRENCY)}
              />
            </ReviewRow>

            <AppDivider marginVertical={false} />

            <ReviewRow label={t("sendMoney.summary.beneficiaryReceives")}>
              <FlagValue
                currency={receiveCurrency}
                text={formatMoney(quote.receiveAmount, receiveCurrency)}
              />
            </ReviewRow>
          </>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  titles: {
    gap: Spacing.s3,
    marginBottom: Spacing.s7,
  },
  rows: {
    gap: Spacing.s5,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.s4,
  },
  // Uppercase by style, so the translations stay normal text
  label: {
    flex: 1,
    textTransform: "uppercase",
  },
  value: {
    flex: 1,
    gap: Spacing.s2,
  },
  uppercase: {
    textTransform: "uppercase",
  },
  flagValue: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
  },
});
