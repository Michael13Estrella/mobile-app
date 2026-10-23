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
