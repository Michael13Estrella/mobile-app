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

import { Language } from "../types/language.types";

const DEFAULT_LOCALE = "en-US";

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

export const formatIsoDate = (iso: string, locale: Language): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, year, month, day] = match;
  return locale === "ja"
    ? `${year}年${month}月${day}日`
    : `${month}/${day}/${year}`;
};
