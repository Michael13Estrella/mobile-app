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

import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { Spacing } from "../../../constants/spacing";
import { AppText } from "../../common/AppText";
import { ExchangeRate } from "../../../types";
import { RemittanceQuote } from "../../../utils/remittance/quote";
import { useTranslation } from "../../../hooks/useTranslation";
import { useFormatMoney } from "../../../hooks/useFormatMoney";
import { INTL_LOCALE } from "../../../constants/locale";
import {
  CURRENCY_COUNTRY,
  CURRENCY_FRACTION_DIGITS,
  WALLET_CURRENCY,
} from "../../../constants/currency";
import { AppCard } from "../../common/AppCard";
import { formatAmount } from "../../../utils/format/formatCurrency";
import { AppDivider } from "../../common/AppDivider";
import { BrandCountryFlag } from "../../icons";

// The rate as the design shows it: "1 JPY = 0.3850 PHP"
const RATE_FRACTION_DIGITS = 4;
const FLAG_SIZE = 20;

function SummaryRow({
  label,
  children,
}: Readonly<{ label: string; children: React.ReactNode }>) {
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
      {children}
    </View>
  );
}

type RemittanceSummaryCardProps = Readonly<{
  quote: RemittanceQuote;
  // The payout's currency
  receiveCurrency: string;
  // The live rates; the pair's rate is shown (none for JPY -> JPY)
  rates: readonly ExchangeRate[];
}>;

/**
 * Send Money's breakdown of an amount: the rate (or, JPY -> JPY, the lifting
 * charge), the remittance charge, the total payment, and what the
 * beneficiary receives.
 *
 * @example <RemittanceSummaryCard quote={quote} receiveCurrency="PHP" rates={rates} />
 */
export function RemittanceSummaryCard({
  quote,
  receiveCurrency,
  rates,
}: RemittanceSummaryCardProps) {
  const { colors } = useAppTheme();
  const { t, locale } = useTranslation();
  const formatMoney = useFormatMoney();
  const intlLocale = INTL_LOCALE[locale];

  // The pair's rate in its own direction ("1 JPY = 0.3850 PHP",
  // "1 USD = 154.6500 JPY")
  const pairRate = rates.find(
    (r) =>
      (r.fromCurrency === WALLET_CURRENCY &&
        r.toCurrency === receiveCurrency) ||
      (r.fromCurrency === receiveCurrency && r.toCurrency === WALLET_CURRENCY),
  );

  return (
    <AppCard style={styles.card}>
      {pairRate && (
        <SummaryRow label={t("sendMoney.summary.exchangeRate")}>
          <AppText typographyType="body3" color={colors.textPrimary}>
            {t("sendMoney.summary.rate", {
              from: pairRate.fromCurrency,
              rate: formatAmount(
                pairRate.rate,
                intlLocale,
                RATE_FRACTION_DIGITS,
              ),
              to: pairRate.toCurrency,
            })}
          </AppText>
        </SummaryRow>
      )}

      {quote.liftingFee !== null && (
        <SummaryRow label={t("sendMoney.summary.liftingCharge")}>
          <AppText typographyType="body3" color={colors.textPrimary}>
            {formatMoney(quote.liftingFee, WALLET_CURRENCY)}
          </AppText>
        </SummaryRow>
      )}

      <SummaryRow label={t("sendMoney.summary.remittanceCharge")}>
        <AppText typographyType="body3" color={colors.textPrimary}>
          {formatMoney(quote.charge, WALLET_CURRENCY)}
        </AppText>
      </SummaryRow>

      <SummaryRow label={t("sendMoney.summary.totalPayment")}>
        <AppText typographyType="body3" color={colors.textPrimary}>
          {formatMoney(quote.totalPayment, WALLET_CURRENCY)}
        </AppText>
      </SummaryRow>

      <AppDivider marginVertical={false} />

      {/* Beneficiary receives: flag, currency, then the amount in bold */}
      <SummaryRow label={t("sendMoney.summary.beneficiaryReceives")}>
        <View style={styles.received}>
          <BrandCountryFlag
            code={CURRENCY_COUNTRY[receiveCurrency] ?? ""}
            size={FLAG_SIZE}
            shape="circle"
          />
          <AppText typographyType="body2" color={colors.textPrimary}>
            {receiveCurrency}
          </AppText>
          <AppText
            typographyType="body1"
            weight="semibold"
            color={colors.textPrimary}
          >
            {formatAmount(
              quote.receiveAmount,
              intlLocale,
              CURRENCY_FRACTION_DIGITS[receiveCurrency],
            )}
          </AppText>
        </View>
      </SummaryRow>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.s6,
    gap: Spacing.s5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.s4,
  },
  label: {
    flexShrink: 1,
    textTransform: "uppercase",
  },
  received: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s3,
  },
});
