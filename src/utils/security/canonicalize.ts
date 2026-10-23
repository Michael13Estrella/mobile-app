/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import canonicalize from "canonicalize";

/**
 * Turns a value into canonical JSON (RFC 8785, "JCS"): keys sorted, no
 * whitespace, numbers in one standard form. The same data always gives the
 * same string, so the app and the server sign identical bytes (DBRS / HMAC).
 *
 * @param obj - The value to serialize (object, array or primitive).
 * @returns The canonical JSON string, or "" for `undefined`.
 * @example jcs({ b: 1, a: 2 }); // '{"a":2,"b":1}'
 */
export const jcs = (obj: unknown): string => canonicalize(obj) ?? "";
