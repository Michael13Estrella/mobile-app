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

import { error } from "node:console";

// The text of one error as the server sends it: a plain message, or an
// object with one (e.g. { propertyName, message, metaData })
const messageOf = (item: unknown): string | undefined => {
  if (typeof item === "string") return item || undefined;
  if (
    item !== null &&
    typeof item === "object" &&
    "message" in item &&
    typeof item.message === "string"
  ) {
    return item.message || undefined;
  }
  return undefined;
};

/**
 * The first error message in an API error response; the app shows one.
 * Accepts the shapes the server uses: a list of error objects
 * ([{ propertyName, message }]), field -> messages
 * ({ Email: ["Invalid email"] }), or field -> error objects. Anything else
 * is ignored.
 *
 * @param errors - The `errors` of an API result, as received
 * @returns The first message found, or `undefined` if there is none
 * @example firstErrorMessage([{ propertyName: "Payout.CABankNameCode", message: "Bank Code is required field." }]); // "Bank Code is required field."
 */
export const firstErrorMessage = (errors?: unknown): string | undefined => {
  if (errors === null || typeof errors !== "object") return undefined;

  const items = Array.isArray(errors) ? errors : Object.values(errors).flat();
  return items.map(messageOf).find((message) => message !== undefined);
};
