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

import { INTL_LOCALE } from "../../constants/locale";
import { Language } from "../../types/language.types";

const DEFAULT_LOCALE = INTL_LOCALE.en;
const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * A date as "Jun 29, 2026" (en-US) / "2026年6月29日" (ja-JP).
 *
 * @param dateString - An ISO date or date-time.
 * @param locale - The Intl locale (default en-US).
 * @param timeZone - The time zone to show it in (default: the device's).
 * @returns The formatted date.
 * @example formatDate("2026-06-29T00:00:00Z", "en-US", "Asia/Tokyo"); // "Jun 29, 2026"
 */
export const formatDate = (
  dateString: string,
  locale: string = DEFAULT_LOCALE,
  timeZone?: string,
): string => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone,
  });
};

/**
 * A date and time for lists, 24-hour: "23 Feb 2026, 07:32" (en-GB) /
 * "2026年2月23日 07:32" (ja-JP). Used by recent transactions.
 *
 * @param dateString - An ISO date-time.
 * @param locale - The Intl locale (default en-US), from `LIST_DATE_LOCALE`.
 * @param timeZone - The time zone to show it in (default: the device's).
 * @returns The formatted date and time.
 * @example formatShortDateTime("2026-02-22T22:32:00Z", "en-GB", "Asia/Tokyo"); // "23 Feb 2026, 07:32"
 */
export const formatShortDateTime = (
  dateString: string,
  locale: string = DEFAULT_LOCALE,
  timeZone?: string,
): string =>
  new Date(dateString).toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  });

/**
 * A date and time: "Jun 29, 2026, 11:30 PM" (en-US). Used by the exchange
 * rate card ("as of …", in Japan time).
 *
 * @param dateString - An ISO date-time.
 * @param locale - The Intl locale (default en-US).
 * @param timeZone - The time zone to show it in (default: the device's).
 * @returns The formatted date and time.
 * @example formatDateTime("2026-06-29T14:30:00Z", "ja-JP", "Asia/Tokyo"); // "2026年6月29日 23:30"
 */
export const formatDateTime = (
  dateString: string,
  locale: string = DEFAULT_LOCALE,
  timeZone?: string,
): string => {
  return new Date(dateString).toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
};

/**
 * A date and time with seconds: "Nov 25, 2023, 2:31:50 PM" (en-US). Used
 * by "Last Login" on Home.
 *
 * @param dateString - An ISO date-time.
 * @param locale - The Intl locale (default en-US).
 * @param timeZone - The time zone to show it in (default: the device's).
 * @returns The formatted date and time.
 * @example formatDateTimeWithSeconds("2023-11-25T05:31:50Z", "en-US", "Asia/Tokyo"); // "Nov 25, 2023, 2:31:50 PM"
 */
export const formatDateTimeWithSeconds = (
  dateString: string,
  locale: string = DEFAULT_LOCALE,
  timeZone?: string,
): string => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZone,
  });
};

/**
 * A date-only ISO value as "MM/DD/YYYY" (en) or "YYYY年MM月DD日" (ja),
 * without any time zone conversion (safe for birth dates and expiry dates).
 *
 * @param iso - The date as `YYYY-MM-DD`.
 * @param locale - The app language.
 * @returns The formatted date, or `iso` unchanged if it isn't `YYYY-MM-DD`.
 * @example formatIsoDate("2026-06-29", "ja"); // "2026年06月29日"
 */
export const formatIsoDate = (iso: string, locale: Language): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  return locale === "ja"
    ? `${year}年${month}月${day}日`
    : `${month}/${day}/${year}`;
};
