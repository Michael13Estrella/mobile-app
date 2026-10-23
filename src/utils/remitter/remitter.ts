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

import { isNickNameRequired } from "../../constants/nationality";
import { Remitter } from "../../types";
import { formatPersonName } from "../format/formatName";

type NameFields = Pick<
  Remitter,
  "nationality" | "nickName" | "lastName" | "firstName"
>;

/**
 * The name to greet the remitter with: the nickname for non-Japanese
 * nationals (they register one), the last name for Japanese nationals; the
 * first name if that field is empty. Formatted for display ("JUAN" -> "Juan").
 *
 * @param remitter - The remitter's nationality and name fields.
 * @returns The display name.
 * @example getRemitterDisplayName({ nationality: "PH", nickName: "JUN", … }); // "Jun"
 */
export const getRemitterDisplayName = (remitter: NameFields): string => {
  const preferred = isNickNameRequired(remitter.nationality)
    ? remitter.nickName
    : remitter.lastName;
  return formatPersonName(preferred.trim() || remitter.firstName.trim());
};
