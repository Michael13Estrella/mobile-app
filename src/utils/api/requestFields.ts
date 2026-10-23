/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-23
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

/**
 * An optional form value for an API request: trimmed, or left out
 * (undefined) when empty, since the API takes missing fields.
 *
 * @param value - The form value ("" when not filled in)
 * @returns The trimmed value, or undefined when empty
 * @example optionalField("  Makati "); // "Makati"
 */
export const optionalField = (value: string): string | undefined =>
  value.trim() || undefined;
