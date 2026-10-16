/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-06
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { PREFECTURE_OPTIONS } from "../constants/prefectures";

/**
 * Matches a prefecture name (e.g. from the postal code lookup) to the
 * prefecture list, by its value or its label, ignoring case and extra
 * spaces. Not found -> "", so the user picks it from the list instead of
 * getting a value the picker can't show.
 *
 * @param name - The prefecture name ("AOMORI KEN", "Aomori", "aomori").
 * @returns The list's value ("AOMORI KEN"), or "" if there's no match.
 * @example findPrefectureValue("Tokyo"); // "TOKYO TO"
 */
export const findPrefectureValue = (name: string): string => {
  const normalized = name.trim().replaceAll(/\s+/g, " ").toUpperCase();
  return (
    PREFECTURE_OPTIONS.find(
      (option) => option.value === normalized || option.label === normalized,
    )?.value ?? ""
  );
};
