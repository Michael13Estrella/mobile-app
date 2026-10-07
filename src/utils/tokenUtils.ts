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
import { User } from "../types/auth.types";

interface KeycloakTokenPayload {
  readonly sub: string;
  readonly email: string;
}

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

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
