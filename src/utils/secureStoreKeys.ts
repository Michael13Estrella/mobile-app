/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-08-25
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// Single source of truth for building a per-user SecureStore key
// from a prefix (defined in SECURITY.STORE_KEYS) + the Keycloak user id.
export const buildUserKey = (prefix: string, userId: string): string =>
  `${prefix}${userId}`;
