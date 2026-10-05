import * as SecureStore from "expo-secure-store";
import { AuthTokens } from "../../types";

const TOKEN_KEYS = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
} as const;

const options = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export const tokenService = {
  saveTokens: async (token: AuthTokens): Promise<void> => {
    await SecureStore.setItemAsync(
      TOKEN_KEYS.ACCESS,
      token.accessToken,
      options,
    );
    await SecureStore.setItemAsync(
      TOKEN_KEYS.REFRESH,
      token.refreshToken,
      options,
    );
  },

  getAccessToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS);
  },

  getRefreshToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
  },

  clearTokens: async (): Promise<void> => {
    await SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS);
    await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH);
  },
};
