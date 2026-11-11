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

import { useCallback } from "react";
import { useTranslation } from "./useTranslation";
import { ExchangeRate } from "../types";
import { formatAmount } from "../utils/format/formatCurrency";
import { INTL_LOCALE } from "../constants/locale";
import { RATE_FRACTION_DIGITS } from "../constants/currency";

/**
 * Formats an exchange rate in its own direction, in the app's language:
 * "1 JPY = 0.3850 PHP", "1 USD = 154.6500 JPY".
 *
 * @returns (rate) => the text
 * @example const formatRate = useFormatRate(); formatRate(pairRate); // "1 JPY = 0.3850 PHP"
 */
export function useFormatRate() {
  const { t, locale } = useTranslation();

  return useCallback(
    (rate: ExchangeRate) =>
      t("sendMoney.summary.rate", {
        from: rate.fromCurrency,
        rate: formatAmount(
          rate.rate,
          INTL_LOCALE[locale],
          RATE_FRACTION_DIGITS,
        ),
        to: rate.toCurrency,
      }),
    [t, locale],
  );
}
