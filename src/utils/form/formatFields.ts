/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-08-27
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// Helpers for normalizing a form payload right before it's sent: never
// apply them while the user is still editing a field, only at submission.

/**
 * Uppercases the given string fields (the backend expects names etc. in
 * capitals). Returns a copy; the original object isn't changed.
 *
 * @param obj - The payload.
 * @param fields - The fields to uppercase (non-strings are left as they are).
 * @returns A copy with those fields uppercased.
 * @example uppercaseFields({ lastName: "dela cruz" }, ["lastName"]); // { lastName: "DELA CRUZ" }
 */
export const uppercaseFields = <T extends object>(
  obj: T,
  fields: (keyof T)[],
): T => {
  const result = { ...obj };
  fields.forEach((field) => {
    const value = result[field];
    if (typeof value === "string") {
      result[field] = value.toUpperCase() as T[typeof field];
    }
  });
  return result;
};

/**
 * Trims spaces at both ends of every string field, except `skip` (e.g. a
 * password, where spaces may be intended). Returns a copy.
 *
 * @param obj - The payload.
 * @param skip - Fields to leave as they are.
 * @returns A copy with the string fields trimmed.
 * @example trimFields({ email: " a@b.jp " }); // { email: "a@b.jp" }
 */
export const trimFields = <T extends object>(
  obj: T,
  skip: (keyof T)[] = [],
): T => {
  const result = { ...obj };
  (Object.keys(result) as (keyof T)[]).forEach((field) => {
    if (skip.includes(field)) return;
    const value = result[field];
    if (typeof value === "string") {
      result[field] = value.trim() as T[typeof field];
    }
  });
  return result;
};

/**
 * Shows a 7-digit Japanese postal code with its hyphen.
 *
 * @param postalCode - The postal code digits.
 * @returns "123-4567", or the input unchanged if it isn't 7 digits.
 * @example formatPostalCode("1234567"); // "123-4567"
 */
export const formatPostalCode = (postalCode: string): string =>
  /^\d{7}$/.test(postalCode)
    ? `${postalCode.slice(0, 3)}-${postalCode.slice(3)}`
    : postalCode;
