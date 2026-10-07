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

// Matches a prefecture name (e.g. from the postal lookup) to the list:
// "AOMORI KEN", "Aomori" or "aomori" -> "AOMORI KEN". Not found -> "" so the

import { PREFECTURE_OPTIONS } from "../constants/prefectures";

// user picks it from the list instead of getting an invisible value.
export const findPrefectureValue = (name: string): string => {
  const normalized = name.trim().toUpperCase();
  return (
    PREFECTURE_OPTIONS.find(
      (option) => option.value === normalized || option.label === normalized,
    )?.value ?? ""
  );
};
