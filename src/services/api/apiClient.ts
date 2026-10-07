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

import { tokenService } from "../auth/tokenService";
import { keycloakService } from "../auth/keycloakService";
import { isTokenExpired } from "../../utils/tokenUtils";
import { store } from "../../store";
import { ApiResult, Method, SecurityMode, request } from "./apiTransport";

export { buildSigned, buildPlain } from "./apiTransport";
export type { ApiResult } from "./apiTransport";

let refreshPromise: Promise<void> | null = null;

const ensureValidToken = async (): Promise<void> => {
  const token = await tokenService.getAccessToken();
  if (!token || !isTokenExpired(token)) return;

  if (store.getState().ui.isLocked) return;

  if (!refreshPromise) {
    refreshPromise = keycloakService
      .refreshAccessToken()
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }

  await refreshPromise;
};

const gatedRequest = async <T>(
  method: Method,
  path: string,
  body: unknown,
  mode: SecurityMode,
): Promise<ApiResult<T>> => {
  await ensureValidToken();
  return request<T>(method, path, body, mode);
};

const createMethods = (mode: SecurityMode) => {
  return {
    get: <T>(path: string) => gatedRequest<T>("GET", path, undefined, mode),
    post: <T>(path: string, body?: unknown) =>
      gatedRequest<T>("POST", path, body, mode),
    put: <T>(path: string, body?: unknown) =>
      gatedRequest<T>("PUT", path, body, mode),
    delete: <T>(path: string) =>
      gatedRequest<T>("DELETE", path, undefined, mode),
  };
};

export const apiClient = {
  plain: createMethods("plain"), // unsigned, auto-Bearer if logged in
  dbrs: createMethods("dbrs"), // DBRS
  critical: createMethods("critical"), // DBRS + HMAC
  encrypt: createMethods("encrypt"), // DBRS + HMAC + encrypted body
};
