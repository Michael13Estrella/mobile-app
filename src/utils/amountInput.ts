/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-14
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// Largest whole-number part an amount field accepts (999,999,999)
const MAX_INTEGER_DIGITS = 9;
const DECIMAL_POINT = ".";
// Tiny allowance for floating-point noise (4782.6 stored as 4782.5999…).
const ROUNDING_EPSILON = 1e-9;

/**
 * Cleans what the user typed into a plain amount string: digits and one
 * decimal point only, at most `fractionDigits` decimals, no leading zeros,
 * at most 9 whole digits.
 *
 * @param text - The raw text from the input (may contain grouping commas).
 * @param fractionDigits - Decimals allowed (0 = whole numbers only).
 * @returns The clean amount string ("12000", "15.5").
 * @example sanitizeAmountInput("12,000", 0); // "12000"
 */
export const sanitizeAmountInput = (
  text: string,
  fractionDigits: number,
): string => {
  const cleaned = text.replace(/[^\d.]/g, "");
  const [rawInteger = "", ...rest] = cleaned.split(DECIMAL_POINT);

  const integer = rawInteger
    .replace(/^0+(?=\d)/, "")
    .slice(0, MAX_INTEGER_DIGITS);

  if (fractionDigits === 0 || rest.length === 0) return integer;

  const fraction = rest.join("").slice(0, fractionDigits);
  // "." typed first -> "0."
  return `${integer || "0"}${DECIMAL_POINT}${fraction}`;
};

/**
 * The number in a clean amount string.
 *
 * @param value - A string from `sanitizeAmountInput`.
 * @returns The amount, or 0 when empty or not a number.
 * @example parseAmountInput("12000"); // 12000
 */
export const parseAmountInput = (value: string): number => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

/**
 * Adds grouping to a clean amount for display while typing; keeps a
 * trailing "." so the user can continue typing decimals.
 *
 * @param value - A string from `sanitizeAmountInput`.
 * @param locale - The Intl locale for grouping (e.g. "en-US").
 * @returns The display text ("12,000", "1,500.").
 * @example formatAmountInput("1500.5", "en-US"); // "1,500.5"
 */
export const formatAmountInput = (value: string, locale: string): string => {
  if (!value) return "";
  const [integer = "", fraction] = value.split(DECIMAL_POINT);
  const grouped = Number(integer || "0").toLocaleString(locale);
  return fraction === undefined
    ? grouped
    : `${grouped}${DECIMAL_POINT}${fraction}`;
};

/**
 * Rounds up to `fractionDigits`, so an amount always covers its target.
 *
 * @param value - The number to round.
 * @param fractionDigits - Decimals to keep (0 = whole numbers).
 * @returns The rounded-up number.
 * @example roundUp(12547.01, 0); // 12548
 */
export const roundUp = (value: number, fractionDigits: number): number => {
  const factor = 10 ** fractionDigits;
  return Math.ceil(value * factor - ROUNDING_EPSILON) / factor;
};

/**
 * Rounds like C#'s `Math.Round` (banker's rounding): to the nearest value,
 * exact halves to the even one. Matches the server's received amount.
 *
 * @param value - The number to round.
 * @param fractionDigits - Decimals to keep.
 * @returns The rounded number.
 * @example roundHalfEven(2.5, 0); // 2
 */
export const roundHalfEven = (
  value: number,
  fractionDigits: number,
): number => {
  const factor = 10 ** fractionDigits;
  const scaled = value * factor;
  const floor = Math.floor(scaled);
  const fraction = scaled - floor;

  if (fraction > 0.5) return (floor + 1) / factor;
  if (fraction < 0.5) return floor / factor;
  // Exactly half: to the even neighbor.
  return (floor % 2 === 0 ? floor : floor + 1) / factor;
};
