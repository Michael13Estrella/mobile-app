/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-02
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// Amounts are shown with 2 decimals, the currency code next to them
// (e.g. "JPY" + "1,000,000.00")
const AMOUNT_FRACTION_DIGITS = 2;

/**
 * Formats an amount with grouping and a fixed number of decimals, without a
 * currency symbol (the screens show the code next to it, e.g. "JPY").
 *
 * @param amount - The amount to format.
 * @param locale - The Intl locale (e.g. "en-US"), from `INTL_LOCALE`.
 * @param fractionDigits - Decimals to show (default 2; 0 for whole yen).
 * @returns The formatted amount ("1,000,000.00").
 * @example formatAmount(1500, "en-US", 0); // "1,500"
 */
export const formatAmount = (
  amount: number,
  locale: string,
  fractionDigits: number = AMOUNT_FRACTION_DIGITS,
): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
