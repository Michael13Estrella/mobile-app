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

// Deterministic, RFC 8785 bytes - must match the server exactly.
export const jcs = (obj: unknown): string => canonicalize(obj) ?? "";
