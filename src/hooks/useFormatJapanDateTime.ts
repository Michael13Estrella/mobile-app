/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import {
  INTL_LOCALE,
  JAPAN_TIME_ZONE,
  JAPAN_TIME_ZONE_LABEL,
} from "../constants/locale";
import { formatDate, formatTime } from "../utils/format/formatDate";
import { useTranslation } from "./useTranslation";

/**
 * A date-time in Japan time, in the app language:
 * "Oct 1, 2026 · 10:30 AM JST".
 *
 * @returns The formatter, taking an ISO date-time
 * @example const formatJapanDateTime = useFormatJapanDateTime(); formatJapanDateTime(submittedAt);
 */
export function useFormatJapanDateTime() {
  const { t, locale } = useTranslation();
  const intlLocale = INTL_LOCALE[locale];

  return (isoDateTime: string): string =>
    t("common.japanDateTime", {
      date: formatDate(isoDateTime, intlLocale, JAPAN_TIME_ZONE),
      time: formatTime(isoDateTime, intlLocale, JAPAN_TIME_ZONE),
      zone: JAPAN_TIME_ZONE_LABEL,
    });
}
