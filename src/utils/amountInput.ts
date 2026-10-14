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

// Cleans what the user typed into a plain amount string ("12000", "15.5"):
// digits only (grouping commas removed), at most one decimal point and
// `fractionDigits` decimals, no leading zeros, capped length.
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

// The number in a sanitized amount string; 0 when empty.
export const parseAmountInput = (value: string): number => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

// Shows a sanitized amount with grouping while typing ("12000" -> "12,000",
// "1500.5" -> "1,500.5"); keeps a trailing "." so the user can continue.
export const formatAmountInput = (value: string, locale: string): string => {
  if (!value) return "";
  const [integer = "", fraction] = value.split(DECIMAL_POINT);
  const grouped = Number(integer || "0").toLocaleString(locale);
  return fraction === undefined
    ? grouped
    : `${grouped}${DECIMAL_POINT}${fraction}`;
};

// Tiny allowance for floating-point noise (4782.6 stored as 4782.5999…).
const ROUNDING_EPSILON = 1e-9;

// Up to `fractionDigits`: the amount to send always covers the target.
export const roundUp = (value: number, fractionDigits: number): number => {
  const factor = 10 ** fractionDigits;
  return Math.ceil(value * factor - ROUNDING_EPSILON) / factor;
};

// Same as C#'s Math.Round(value, fractionDigits) (MidpointRounding.ToEven,
// "banker's rounding"), which the server uses for the received amount: scale,
// round to the nearest integer with exact halves going to the even one,
// scale back. Use it wherever the app must show the server's own result.
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
