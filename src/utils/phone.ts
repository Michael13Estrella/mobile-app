import { PHONE_DIGIT_PLACEHOLDER, PhoneCountry } from "../constants/phone";

export const getPhoneDigitCount = (country: PhoneCountry): number =>
  country.template.split("").filter((char) => char === PHONE_DIGIT_PLACEHOLDER)
    .length;

// Cleans typed or pasted input into the digits after the country code:
// - "+81 90-1234-5678" (e.g. from contacts) -> drops the country code
// - "090..." -> drops the domestic leading 0 (not used after a country code)
export const toPhoneDigits = (country: PhoneCountry, text: string): string => {
  const digits = text.replace(/\D/g, "");
  const hasCountryPrefix =
    text.trim().startsWith("+") && digits.startsWith(country.dialCode);
  const national = hasCountryPrefix
    ? digits.slice(country.dialCode.length)
    : digits;

  return national.replace(/^0+/, "").slice(0, getPhoneDigitCount(country));
};

export const isValidPhoneNumber = (
  country: PhoneCountry,
  digits: string,
): boolean =>
  digits.length === getPhoneDigitCount(country) && /^\d+$/.test(digits);

// "9012345678" -> "+81 90 - 1234 - 5678" (for summaries like the confirm screen)
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
