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

const ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Whether an ISO date is a real calendar day (rejects 2026-02-30,
 * 2025-02-29 in a non-leap year, month 13, wrong formats).
 *
 * @param iso - The date as `YYYY-MM-DD`.
 * @returns `true` for a real date.
 * @example isValidCalendarDate("2024-02-29"); // true (leap year)
 */
export const isValidCalendarDate = (iso: string): boolean => {
  const match = ISO_DATE_REGEX.exec(iso);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12) return false;

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return false;

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

/**
 * Whether a date is after today (today itself is not in the future), e.g.
 * for an ID's expiry date.
 *
 * @param iso - The date as `YYYY-MM-DD`.
 * @returns `true` from tomorrow on.
 * @example isFutureDate("2099-01-01"); // true
 */
export const isFutureDate = (iso: string): boolean => {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() > today.getTime();
};

/**
 * Age in full years today, counting the birthday itself.
 *
 * @param iso - The birth date as `YYYY-MM-DD`.
 * @returns The age in years.
 * @example calculateAge("2000-10-16"); // 26 on 2026-10-16
 */
export const calculateAge = (iso: string): number => {
  const [year, month, day] = iso.split("-").map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;
  const hasHadBirthdayThisYear =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
};
