/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

const SECONDS_PER_MINUTE = 60;

const twoDigits = (value: number) => value.toString().padStart(2, "0");

/**
 * Formats a countdown as minutes and seconds, e.g. for "Resend code in".
 *
 * @param totalSeconds - The remaining seconds (negative counts as 0).
 * @returns The time as `MM:SS`.
 * @example formatCooldown(299); // "04:59"
 */
export const formatCooldown = (totalSeconds: number): string => {
  const remaining = Math.max(0, totalSeconds);
  const minutes = Math.floor(remaining / SECONDS_PER_MINUTE);
  const seconds = remaining % SECONDS_PER_MINUTE;
  return `${twoDigits(minutes)}:${twoDigits(seconds)}`;
};
