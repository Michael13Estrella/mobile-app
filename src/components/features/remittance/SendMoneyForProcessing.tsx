/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-12
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ReactNode } from "react";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { Image, StyleSheet, View } from "react-native";
import metrobankLogo from "../../../../assets/logos/cash-pick-up/metrobank.png";
import { Spacing } from "../../../constants/spacing";
import { AppText } from "../../common/AppText";
import { SendMoneyFormValues } from "../../../schemas/remittance/sendMoneySchema";
import { BeneficiaryPayout, BeneficiarySummary } from "../../../types";
import { CompanyDetailsFormValues } from "../../../schemas/remittance/companyDetailsSchema";
import { SendMoneyConfirmation } from "../../../store/slices/sendMoneySlice";
import { useTranslation } from "../../../hooks/useTranslation";
import { useFormatMoney } from "../../../hooks/useFormatMoney";
import { useFormatRate } from "../../../hooks/useFormatRate";
import { useSendMoneyReasons } from "../../../hooks/useSendMoneyReasons";
import {
  INTL_LOCALE,
  JAPAN_TIME_ZONE,
  JAPAN_TIME_ZONE_LABEL,
} from "../../../constants/locale";
import {
  formatMetrobankAccountNo,
  getPayoutCurrency,
} from "../../../utils/beneficiary/payout";
import { PAYOUT_TYPE } from "../../../constants/payout";
import { AppScreen } from "../../common/AppScreen";
import { AppHeader } from "../../common/AppHeader";
import { AppButton } from "../../common/AppButton";
import { StatusIcon } from "../../common/StatusIcon";
import { AppCard } from "../../common/AppCard";
import { getBeneficiaryTitle } from "../../../utils/beneficiary/beneficiary";
import { parseAmountInput } from "../../../utils/remittance/amountInput";
import { WALLET_CURRENCY } from "../../../constants/currency";
import { AppDivider } from "../../common/AppDivider";
import { formatPhoneNumber } from "../../../utils/format/phone";
import { COMPANY_PHONE_COUNTRY } from "../../../constants/phone";
import { send } from "node:process";
import { formatDate, formatTime } from "../../../utils/format/formatDate";

// "LABEL            value": the label in grey capitals on the left, the
// value right-aligned
function DetailRow({
  label,
  children,
}: Readonly<{ label: string; children: ReactNode }>) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.row}>
      <AppText
        typographyType="overline2"
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

// A row's value text, right-aligned
function DetailValue({ text }: Readonly<{ text: string }>) {
  const { colors } = useAppTheme();
  return (
    <AppText
      typographyType="body3"
      color={colors.textPrimary}
      style={styles.valueText}
    >
      {text}
    </AppText>
  );
}

type SendMoneyForProcessingProps = Readonly<{
  form: SendMoneyFormValues;
  beneficiary: BeneficiarySummary;
  payout: BeneficiaryPayout;
  // Only for remittance that needed them
  companyDetails: CompanyDetailsFormValues | null;
  // What was sent (Review's confirmed amounts and rate)
  confirmation: SendMoneyConfirmation;
  // When the send succeeded (ISO)
  sentAt: string;
  // "Go to dashboard"
  onDone: () => void;
}>;

/**
 * Send Money's "Transaction Details", after a successful send: the
 * remittance is being processed, and what was sent.
 *
 * @example <SendMoneyForProcessing form={form} beneficiary={beneficiary} payout={payout} companyDetails={null} confirmation={confirmation} sentAt={sentAt} onDone={goToDashboard} />
 */
export function SendMoneyForProcessing({
  form,
  beneficiary,
  payout,
  companyDetails,
  confirmation,
  sentAt,
  onDone,
}: SendMoneyForProcessingProps) {
  const { colors } = useAppTheme();
  const { t, locale } = useTranslation();
  const formatMoney = useFormatMoney();
  const formatRate = useFormatRate();
  const { sourceFund, purpose } = useSendMoneyReasons(form);
  const intlLocale = INTL_LOCALE[locale];

  const { quote, rate } = confirmation;
  const receiveCurrency = getPayoutCurrency(payout);
  const isMetrobank = payout.payoutType === PAYOUT_TYPE.METROBANK_ACCOUNT;
  const isCashPickup = payout.payoutType === PAYOUT_TYPE.CASH_PICKUP;

  return (
    <AppScreen
      gradient
      contentGap={Spacing.s7}
      header={<AppHeader title={t("sendMoney.forProcessing.headerTitle")} />}
      footer={
        <AppButton
          label={t("common.goToDashboard")}
          variant="gradient"
          onPress={onDone}
        />
      }
    >
      <View style={styles.status}>
        <StatusIcon status="pending" />
        <AppText
          typographyType="h4"
          color={colors.textPrimary}
          style={styles.centered}
        >
          {t("sendMoney.forProcessing.title")}
        </AppText>
        <AppText
          typographyType="body2"
          color={colors.textPrimary}
          style={styles.centered}
        >
          {t("sendMoney.forProcessing.message")}
        </AppText>
      </View>

      <AppCard variant="outlined" style={styles.card}>
        <Image source={metrobankLogo} style={styles.logo} />

        {/* The payout (bank, beneficiary, account) and the amounts */}
        <View style={styles.summary}>
          <View style={styles.summaryColumn}>
            <AppText
              typographyType="title2"
              weight="bold"
              color={colors.textPrimary}
              style={styles.uppercase}
            >
              {payout.bankName}
            </AppText>
            <AppText
              typographyType="body3"
              weight="semibold"
              color={colors.textSecondary}
            >
              {getBeneficiaryTitle(beneficiary)}
            </AppText>
            {/* Cash pick-up: no account */}
            {!isCashPickup && (
              <AppText
                typographyType="body4"
                weight="semibold"
                color={colors.textSecondary}
              >
                {isMetrobank
                  ? formatMetrobankAccountNo(payout.accountNo)
                  : payout.accountNo}
              </AppText>
            )}
          </View>
          <View style={[styles.summaryColumn, styles.summaryAmounts]}>
            <AppText
              typographyType="body2"
              weight="semibold"
              color={colors.textPrimary}
            >
              {formatMoney(quote.receiveAmount, receiveCurrency)}
            </AppText>
            <AppText
              typographyType="body3"
              weight="semibold"
              color={colors.textSecondary}
            >
              {formatMoney(parseAmountInput(form.amount), WALLET_CURRENCY)}
            </AppText>
          </View>
        </View>

        <AppDivider />

        <View style={styles.rows}>
          <DetailRow label={t("sendMoney.review.from")}>
            <DetailValue
              text={t("sendMoney.review.wallet", { currency: WALLET_CURRENCY })}
            />
          </DetailRow>
          <DetailRow label={t("sendMoney.review.sourceFund")}>
            <DetailValue text={sourceFund} />
          </DetailRow>
          <DetailRow label={t("sendMoney.review.purpose")}>
            <DetailValue text={purpose} />
          </DetailRow>

          {/* Additional Details: only when they were asked for */}
          {companyDetails && (
            <>
              <DetailRow label={t("sendMoney.review.companyAddress")}>
                <DetailValue text={companyDetails.companyAddress} />
              </DetailRow>
              <DetailRow label={t("sendMoney.review.companyTelNo")}>
                <DetailValue
                  text={formatPhoneNumber(
                    COMPANY_PHONE_COUNTRY,
                    companyDetails.companyTelNo,
                  )}
                />
              </DetailRow>
            </>
          )}

          {/* JPY -> JPY has no rate, but a lifting charge */}
          {rate && (
            <DetailRow label={t("sendMoney.summary.exchangeRate")}>
              <DetailValue text={formatRate(rate)} />
            </DetailRow>
          )}
          {quote.liftingFee !== null && (
            <DetailRow label={t("sendMoney.summary.liftingCharge")}>
              <DetailValue
                text={formatMoney(quote.liftingFee, WALLET_CURRENCY)}
              />
            </DetailRow>
          )}
          <DetailRow label={t("sendMoney.summary.remittanceCharge")}>
            <DetailValue text={formatMoney(quote.charge, WALLET_CURRENCY)} />
          </DetailRow>
          <DetailRow label={t("sendMoney.summary.totalPayment")}>
            <DetailValue
              text={formatMoney(quote.totalPayment, WALLET_CURRENCY)}
            />
          </DetailRow>

          <DetailRow label={t("sendMoney.forProcessing.dateTimeLabel")}>
            <DetailValue
              text={t("sendMoney.forProcessing.dateTime", {
                date: formatDate(sentAt, intlLocale, JAPAN_TIME_ZONE),
                time: formatTime(sentAt, intlLocale, JAPAN_TIME_ZONE),
                zone: JAPAN_TIME_ZONE_LABEL,
              })}
            />
          </DetailRow>
        </View>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  status: {
    alignItems: "center",
    gap: Spacing.s4,
  },
  centered: {
    textAlign: "center",
  },
  card: {
    paddingTop: Spacing.s6,
    paddingHorizontal: Spacing.s5,
    paddingBottom: Spacing.s7,
    gap: Spacing.s7,
  },
  logo: {
    alignSelf: "center",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.s4,
  },
  summaryColumn: {
    flexShrink: 1,
    gap: Spacing.s2,
  },
  summaryAmounts: {
    alignItems: "flex-end",
  },
  rows: {
    gap: Spacing.s5,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.s4,
  },
  // Uppercase by style, so the translations stay normal text
  label: {
    flexShrink: 0,
    textTransform: "uppercase",
  },
  uppercase: {
    textTransform: "uppercase",
  },
  value: {
    flex: 1,
    alignItems: "flex-end",
  },
  valueText: {
    textAlign: "right",
  },
});
