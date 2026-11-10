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

import { useCallback } from "react";
import { useTranslation } from "./useTranslation";
import { formatAmount } from "../utils/format/formatCurrency";
import { INTL_LOCALE } from "../constants/locale";
import { CURRENCY_FRACTION_DIGITS } from "../constants/currency";

/**
 * Formats an amount with its currency in the app's language, with the
 * currency's own decimals: "JPY 51,000", "PHP 19,250.00".
 *
 * @returns (amount, currency) => the text
 * @example const formatMoney = useFormatMoney(); formatMoney(51_000, "JPY"); // "JPY 51,000"
 */
export function useFormatMoney() {
  const { t, locale } = useTranslation();

  return useCallback(
    (amount: number, currency: string) =>
      t("sendMoney.amountWithCurrency", {
        currency,
        amount: formatAmount(
          amount,
          INTL_LOCALE[locale],
          CURRENCY_FRACTION_DIGITS[currency],
        ),
      }),
    [t, locale],
  );
}
