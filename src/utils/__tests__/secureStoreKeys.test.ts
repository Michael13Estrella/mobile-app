/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { buildUserKey } from "../secureStoreKeys";
import { SECURITY } from "../../constants/security";

// Expo SecureStore only accepts these characters in a key.
const VALID_SECURE_STORE_KEY = /^[\w.-]+$/;
// A Keycloak user id is a UUID.
const KC_ID = "3f2a9c1e-7b4d-4e8a-9f10-2c3d4e5f6a7b";

// Every per-user prefix (the *_PREFIX entries of SECURITY.STORE_KEYS).
const USER_PREFIXES = Object.entries(SECURITY.STORE_KEYS)
  .filter(([name]) => name.endsWith("_PREFIX"))
  .map(([, prefix]) => prefix);

describe("buildUserKey", () => {
  it("joins the prefix and the user id", () => {
    expect(buildUserKey("pin_hash_", KC_ID)).toBe(`pin_hash_${KC_ID}`);
  });

  it("gives different users different keys", () => {
    expect(buildUserKey("pin_hash_", "user-a")).not.toBe(
      buildUserKey("pin_hash_", "user-b"),
    );
  });
});

describe("SECURITY.STORE_KEYS prefixes", () => {
  it("build keys SecureStore accepts", () => {
    for (const prefix of USER_PREFIXES) {
      expect(buildUserKey(prefix, KC_ID)).toMatch(VALID_SECURE_STORE_KEY);
    }
  });

  it("are unique, and none is the start of another", () => {
    // e.g. "pin_" and "pin_hash_" could build the same key for two users.
    for (const a of USER_PREFIXES) {
      for (const b of USER_PREFIXES) {
        if (a !== b) expect(b.startsWith(a)).toBe(false);
      }
    }
    expect(new Set(USER_PREFIXES).size).toBe(USER_PREFIXES.length);
  });
});
