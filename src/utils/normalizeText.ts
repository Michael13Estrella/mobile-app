/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-02
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// Keyboards (iOS Smart Punctuation, some Android keyboards) replace plain
// punctuation with typographic characters that fail half-width validation
// and aren't what the backend expects. Convert them back to ASCII.
const SMART_PUNCTUATION: ReadonlyArray<readonly [RegExp, string]> = [
  [/[\u2018\u2019\u201A\u201B\u2032]/g, "'"], // ‘ ’ ‚ ‛ ′  -> '
  [/[\u201C\u201D\u201E\u201F\u2033]/g, '"'], // “ ” „ ‟ ″  -> "
  [/[\u2010-\u2015\u2212]/g, "-"], // ‐ ‑ ‒ – — ― −    -> -
  [/\u2026/g, "..."], // …                            -> ...
  [/\u00A0/g, " "], // non-breaking space             -> space
];

// "Lawson’" -> "Lawson'", "O’Brien–Smith" -> "O'Brien-Smith"
export const normalizeSmartPunctuation = (text: string): string =>
  SMART_PUNCTUATION.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    text,
  );
