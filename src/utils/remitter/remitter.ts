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
import { formatPersonName, getInitials } from "../format/formatName";

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

/**
 * The remitter's full name for display: the first name, then the last name
 * (no middle name).
 *
 * @param remitter - The remitter's first and last name, as sent (capitals)
 * @returns The formatted name
 * @example getRemitterFullName({ firstName: "JUAN", lastName: "DELA CRUZ" }); // "Juan Dela Cruz"
 */
export const getRemitterFullName = (
  remitter: Pick<Remitter, "firstName" | "lastName">,
): string => formatPersonName(`${remitter.firstName} ${remitter.lastName}`);

/**
 * The remitter's initials for the avatar: the first letters of the first
 * name and of the last name.
 *
 * @param remitter - The remitter's first and last name
 * @returns e.g. "JD" for Juan Dela Cruz
 * @example getRemitterInitials({ firstName: "JUAN", lastName: "DELA CRUZ" }); // "JD"
 */
export const getRemitterInitials = (
  remitter: Pick<Remitter, "firstName" | "lastName">,
): string =>
  getInitials(
    `${remitter.firstName.trim().at(0) ?? ""} ${remitter.lastName.trim().at(0) ?? ""}`,
  );
