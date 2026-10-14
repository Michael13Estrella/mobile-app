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

import { INTL_LOCALE } from "../constants/locale";
import { Language } from "../types/language.types";

const DEFAULT_LOCALE = INTL_LOCALE.en;

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

// "23 Feb 2026, 07:32" (en-GB) / "2026年2月23日 7:32" (ja-JP), device time zone.
export const formatShortDateTime = (
  dateString: string,
  locale: string = DEFAULT_LOCALE,
): string =>
  new Date(dateString).toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

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

export const formatDateTimeWithSeconds = (
  dateString: string,
  locale: string = DEFAULT_LOCALE,
): string => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatIsoDate = (iso: string, locale: Language): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  return locale === "ja"
    ? `${year}年${month}月${day}日`
    : `${month}/${day}/${year}`;
};
