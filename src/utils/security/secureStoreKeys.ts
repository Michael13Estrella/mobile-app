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

/**
 * Builds a per-user SecureStore key: a prefix (from SECURITY.STORE_KEYS)
 * plus the Keycloak user id. Keeps every user's values separate on a
 * shared device.
 *
 * @param prefix - The key prefix, e.g. `SECURITY.STORE_KEYS.PIN_HASH_PREFIX`.
 * @param userId - The Keycloak user id (kcId).
 * @returns The SecureStore key.
 * @example buildUserKey("pin_hash_", "3f2a…"); // "pin_hash_3f2a…"
 */
export const buildUserKey = (prefix: string, userId: string): string =>
  `${prefix}${userId}`;
