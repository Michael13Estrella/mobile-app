/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-01
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { PHONE_DIGIT_PLACEHOLDER, PhoneCountry } from "../constants/phone";

/**
 * How many digits a phone number has after the country code (the number
 * of placeholders in the country's template).
 *
 * @param country - The phone country (e.g. `PHONE_COUNTRIES.JP`).
 * @returns The digit count (JP: 10).
 * @example getPhoneDigitCount(PHONE_COUNTRIES.JP); // 10
 */
export const getPhoneDigitCount = (country: PhoneCountry): number =>
  country.template.split("").filter((char) => char === PHONE_DIGIT_PLACEHOLDER)
    .length;

/**
 * Cleans typed or pasted input into the digits after the country code:
 * removes everything but digits, a leading "+<country code>" (e.g. pasted
 * from contacts) and the domestic leading 0, and caps the length.
 *
 * @param country - The phone country.
 * @param text - What was typed or pasted.
 * @returns The national digits ("9012345678").
 * @example toPhoneDigits(PHONE_COUNTRIES.JP, "+81 90-1234-5678"); // "9012345678"
 */
export const toPhoneDigits = (country: PhoneCountry, text: string): string => {
  const digits = text.replace(/\D/g, "");
  const hasCountryPrefix =
    text.trim().startsWith("+") && digits.startsWith(country.dialCode);
  const national = hasCountryPrefix
    ? digits.slice(country.dialCode.length)
    : digits;

  return national.replace(/^0+/, "").slice(0, getPhoneDigitCount(country));
};

/**
 * Whether the digits are a complete number for the country.
 *
 * @param country - The phone country.
 * @param digits - The national digits (from `toPhoneDigits`).
 * @returns `true` when it's exactly the country's digit count, digits only.
 * @example isValidPhoneNumber(PHONE_COUNTRIES.JP, "9012345678"); // true
 */
export const isValidPhoneNumber = (
  country: PhoneCountry,
  digits: string,
): boolean =>
  digits.length === getPhoneDigitCount(country) && /^\d+$/.test(digits);

/**
 * The full number for display (e.g. the confirm screen): the country code,
 * then the digits in the country's template.
 *
 * @param country - The phone country.
 * @param digits - The national digits.
 * @returns The formatted number; missing digits leave their slots empty.
 * @example formatPhoneNumber(PHONE_COUNTRIES.JP, "9012345678"); // "+81 90 - 1234 - 5678"
 */
export const formatPhoneNumber = (
  country: PhoneCountry,
  digits: string,
): string => {
  let next = 0;
  const masked = country.template.replace(
    new RegExp(PHONE_DIGIT_PLACEHOLDER, "g"),
    () => digits[next++] ?? "",
  );

  return `+${country.dialCode} ${masked}`;
};
