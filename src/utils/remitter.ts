/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { isNickNameRequired } from "../constants/nationality";
import { Remitter } from "../types";

type NameFields = Pick<
  Remitter,
  "nationality" | "nickName" | "lastName" | "firstName"
>;

// Name to address the remitter by: the nickname for non-Japanese nationals
// (they register one), the last name for Japanese nationals. Falls back to
// the first name if that field is empty
export const getRemitterDisplayName = (remitter: NameFields): string => {
  const preferred = isNickNameRequired(remitter.nationality)
    ? remitter.nickName
    : remitter.lastName;
  return preferred.trim() || remitter.firstName.trim();
};
