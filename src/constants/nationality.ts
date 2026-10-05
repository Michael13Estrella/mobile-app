// Show first in the nationality picker, in this order.
export const PINNED_NATIONALITY_CODES = ["PH", "JP"] as const;

export const JAPANESE_NATIONALITY_CODE = "JP";

// Non-Japanese nationals must provide a nickname
// No nationality chosen yet -> not required (the field stays hidden).
export const isNickNameRequired = (nationality: string): boolean =>
  !!nationality && nationality !== JAPANESE_NATIONALITY_CODE;
