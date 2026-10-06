// Generic helpers for normalizing a form payload right before it's sent
// never apply these to how a field is stored/displayed while the use is
// still editing it, only at the submission boundary

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

// "1234567" => "123-4567" (Japanese postal code). Anything else is returned as-is.
export const formatPostalCode = (postalCode: string): string =>
  /^\d{7}$/.test(postalCode)
    ? `${postalCode.slice(0, 3)}-${postalCode.slice(3)}`
    : postalCode;
