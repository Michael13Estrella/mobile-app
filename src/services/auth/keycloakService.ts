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

import * as AuthSession from "expo-auth-session";
import { CONFIG } from "../../constants/config";
import {
  AuthTokens,
  TokenRefreshRequest,
  TokenResponse,
} from "../../types/auth.types";
import { buildSigned } from "../api/apiClient";
import { ENDPOINTS } from "../../constants/endpoints";
import { decodeToken } from "../../utils/tokenUtils";
import { tokenService } from "./tokenService";

const discovery = {
  authorizationEndpoint: `${CONFIG.KEYCLOAK.URL}/protocol/openid-connect/auth`,
  tokenEndpoint: `${CONFIG.KEYCLOAK.URL}/protocol/openid-connect/token`,
  revocationEndpoint: `${CONFIG.KEYCLOAK.URL}/protocol/openid-connect/revoke`,
  endSessionEndpoint: `${CONFIG.KEYCLOAK.URL}/protocol/openid-connect/logout`,
};

export const keycloakService = {
  discovery,

  getRedirectUri: () => {
    return AuthSession.makeRedirectUri({
      scheme: CONFIG.KEYCLOAK.REDIRECT_URI_SCHEME,
      path: CONFIG.KEYCLOAK.REDIRECT_PATH,
    });
  },

  // delegate persistence to the storage layer
  saveTokens: tokenService.saveTokens,
  getAccessToken: tokenService.getAccessToken,
  getRefreshToken: tokenService.getRefreshToken,
  clearTokens: tokenService.clearTokens,

  getCurrentKcId: async (): Promise<string | null> => {
    const token = await keycloakService.getAccessToken();
    return token ? (decodeToken(token)?.id ?? null) : null;
  },

  // Bypasses apiClient's request()/token-refresh gate on purpose -
  // this is the refresh call, so routing it through the gate would deadlock
  // (it would try to refresh itself while already mid-refresh)
  refreshAccessToken: async (
    isPasscodeLogin: boolean = false,
  ): Promise<AuthTokens | null> => {
    try {
      const refreshToken = await tokenService.getRefreshToken();
      if (!refreshToken) return null;

      const body: TokenRefreshRequest = {
        refreshToken,
        isWriteLoginInfo: isPasscodeLogin,
      };
      const { url, init } = await buildSigned(
        "POST",
        ENDPOINTS.AUTH_REFRESH,
        body,
      );
      const res = await fetch(url, init);
      const json = await res.json().catch(() => null);
      if (!res.ok || !json) return null;

      const data = json as TokenResponse;
      const tokens: AuthTokens = {
        ...data,
        refreshToken: data.refreshToken ?? refreshToken,
      };

      await keycloakService.saveTokens(tokens);
      return tokens;
    } catch {
      return null;
    }
  },
};
