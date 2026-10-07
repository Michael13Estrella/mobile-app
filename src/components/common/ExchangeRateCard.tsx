/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-14
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View, ActivityIndicator, Pressable } from "react-native";
import { useAppTheme } from "../../hooks/useAppTheme";
import { Spacing } from "../../constants/spacing";
import { AppCard } from "./AppCard";
import { useTranslation } from "../../hooks/useTranslation";
import { useExchangeRates } from "../../hooks/useExchangeRates";
import { ExchangeRate } from "../../types/exchangeRate.types";
import { AppText } from "./AppText";
import { formatDateTime } from "../../utils/formatDate";
import { BrandIcon, CircleFlag } from "../icons";
import { CURRENCY_COUNTRY } from "../../constants/currency";

const FLAG_SIZE = 24;
const ARROW_SIZE = 16;
const RATE_MAX_DECIMALS = 4;
// Rates are set in Japan time; show them in Japan time on every device.
const RATE_TIME_ZONE = "Asia/Tokyo";

// Share of the row each side gets. The left side ("1 USD") is short, the
// right side ("0.3955 PHP") longer; fixed shares keep the arrows aligned.
const LEFT_SIDE_SHARE = 2;
const RIGHT_SIDE_SHARE = 4;

// Flag of the currency's country (JPY -> JP). Unknown currencies get an
// empty space of the same size, so rows stay aligned.
function CurrencyFlag({ currency }: Readonly<{ currency: string }>) {
  return (
    <CircleFlag code={CURRENCY_COUNTRY[currency] ?? ""} size={FLAG_SIZE} />
  );
}

export function ExchangeRateCard() {
  const { colors } = useAppTheme();
  const { t, locale } = useTranslation();
  const { rates, isLoading, hasError, refresh } = useExchangeRates();

  const intlLocale = locale === "ja" ? "ja-JP" : "en-US";
  const formatRate = (rate: number) =>
    rate.toLocaleString(intlLocale, {
      maximumFractionDigits: RATE_MAX_DECIMALS,
    });

  const renderRow = (rate: ExchangeRate) => (
    <View key={rate.exchangeType} style={styles.row}>
      <View style={[styles.side, styles.leftSide]}>
        <CurrencyFlag currency={rate.fromCurrency} />
        <AppText typographyType="title1" color={colors.textPrimary}>
          1 {rate.fromCurrency}
        </AppText>
      </View>
      <BrandIcon name="arrowNarrowRightLine" size={ARROW_SIZE} />
      <View style={[styles.side, styles.rightSide]}>
        <CurrencyFlag currency={rate.toCurrency} />
        <AppText
          typographyType="title1"
          weight="bold"
          color={colors.textPrimary}
        >
          {formatRate(rate.rate)} {rate.toCurrency}
        </AppText>
      </View>
    </View>
  );
  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator color={colors.primary} />;
    }

    if (hasError || rates.length === 0) {
      return (
        <Pressable onPress={refresh} accessibilityRole="button">
          <AppText typographyType="body2" color={colors.textSecondary}>
            {t("exchangeRate.unavailable")}
          </AppText>
        </Pressable>
      );
    }

    return (
      <>
        <AppText typographyType="body3" color={colors.textSecondary}>
          {t("exchangeRate.asOf", {
            date: formatDateTime(rates[0].rateDate, intlLocale, RATE_TIME_ZONE),
          })}
        </AppText>
        {rates.map(renderRow)}
      </>
    );
  };

  return (
    <AppCard variant="elevated" style={styles.card}>
      {renderContent()}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.s5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s7,
  },
  side: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s5,
  },
  // Sides start from zero width and split the row by fixed shares, so their
  // text can't change their width: the arrows line up in every row.
  leftSide: {
    flexGrow: LEFT_SIDE_SHARE,
    flexBasis: 0,
  },
  rightSide: {
    flexGrow: RIGHT_SIDE_SHARE,
    flexBasis: 0,
  },
});
