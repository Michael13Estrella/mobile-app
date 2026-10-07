/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-08-28
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// 半角 (half-width) Romaji only: standard printable ASCII range.
// Rejects full-width Latin (Ａ), kanji, hiragana, katakana, and any other
// non-ASCII character.
export const HALF_WIDTH_ROMAJI_REGEX = /^[\x20-\x7E]*$/;

export const POSTAL_CODE_REGEX = /^\d{7}$/;

// Password must have Min. 8 characters and include 1 uppercase, 1 lowercase, 1 digit, and 1 special character
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_SPECIAL_CHAR_ONLY_REGEX = /[^A-Za-z0-9\s]/;
export const PASSWORD_HAS_SPACE_REGEX = /\s/;
export const PASSWORD_COMPLEXITY_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/;
