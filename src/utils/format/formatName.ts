/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-13
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

const capitalize = (part: string): string =>
  part.charAt(0).toUpperCase() + part.slice(1);

/**
 * A person's name, sent in capitals by the server, in normal capitalization
 * for display: each word capitalized, also after "-" and "'". For display
 * only: keep the original when sending names back to the API.
 *
 * @param name - The name as sent (e.g. "JUAN DELA CRUZ").
 * @returns The display name, trimmed, single spaces between words.
 * @example formatPersonName("MARY-ANN O'NEIL"); // "Mary-Ann O'Neil"
 */
export const formatPersonName = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .map((word) =>
      word
        .toLowerCase()
        .split("-")
        .map((part) => part.split("'").map(capitalize).join("'"))
        .join("-"),
    )
    .join(" ");

/**
 * The initials of a name for an avatar: the first letter of its first and
 * last word, in capitals.
 *
 * @param name - A full name ("Josh Cullen Santos") or a company name
 * @returns One or two capital letters, or "" for an empty name
 * @example getInitials("Josh Cullen Santos"); // "JS"
 */
export const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words.at(0);
  const last = words.length > 1 ? words.at(-1) : undefined;
  return [first, last]
    .map((word) => word?.at(0) ?? "")
    .join("")
    .toUpperCase();
};
