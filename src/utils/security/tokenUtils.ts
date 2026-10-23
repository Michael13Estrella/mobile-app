/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-02
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { jwtDecode } from "jwt-decode";
import { User } from "../../types/auth.types";

const MS_PER_SECOND = 1000;

interface KeycloakTokenPayload {
  readonly sub: string;
  readonly email: string;
}

/**
 * Reads the user from a Keycloak access token (no signature check: the
 * token comes from our own login, and the server verifies it on every call).
 *
 * @param token - The access token (JWT).
 * @returns The user (`sub` as id, email), or `null` if it can't be read.
 * @example decodeToken(accessToken); // { id: "3f2a…", email: "a@b.jp" }
 */
export const decodeToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<KeycloakTokenPayload>(token);
    return {
      id: decoded.sub,
      email: decoded.email,
    };
  } catch {
    return null;
  }
};

/**
 * Whether a token's expiry (`exp`) has passed. Fails safe: a token that
 * can't be read, or has no `exp`, counts as expired.
 *
 * @param token - The JWT.
 * @returns `true` when expired or unreadable.
 * @example isTokenExpired(accessToken); // false while it's still valid
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    if (typeof exp !== "number") return true;
    return exp * MS_PER_SECOND < Date.now();
  } catch {
    return true;
  }
};
