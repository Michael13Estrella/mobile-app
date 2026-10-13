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

export const formatCurrency = (
  amount: number,
  currency: string = "JPY",
  locale: string = "ja-JP",
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

// Amounts are shown with 2 decimals, the currency code next to them
// (e.g. "JPY" + "1,000,000.00")
const AMOUNT_FRACTION_DIGITS = 2;

// "1,000,000.00" (amount only, no currency symbol).
export const formatAmount = (
  amount: number,
  locale: string,
  fractionDigits: number = AMOUNT_FRACTION_DIGITS,
): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
