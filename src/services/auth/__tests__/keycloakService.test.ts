import * as SecureStore from "expo-secure-store";
import * as AuthSession from "expo-auth-session";
import { buildSigned } from "../../api/apiClient";
import { decodeToken } from "../../../utils/tokenUtils";
import { ENDPOINTS } from "../../../constants/endpoints";
import { keycloakService } from "../keycloakService";
import type { AuthTokens } from "../../../types/auth.types";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: "when-unlocked-device-only",
}));
jest.mock("expo-auth-session", () => ({
  makeRedirectUri: jest.fn(() => "redirect://uri"),
}));
jest.mock("../../api/apiTransport", () => ({
  buildSigned: jest.fn(),
}));
jest.mock("../../../utils/tokenUtils", () => ({
  decodeToken: jest.fn(),
}));

// Storage keys are a stable contract — changing them logs every user out.
const ACCESS = "access_token";
const REFRESH = "refresh_token";
const opts = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

const tokens: AuthTokens = {
  accessToken: "access-1",
  refreshToken: "refresh-1",
  expiresIn: 300,
  tokenType: "Bearer",
};

beforeEach(() => jest.clearAllMocks());

describe("token storage", () => {
  it("saveTokens stores access + refresh with device-only keychain access", async () => {
    await keycloakService.saveTokens(tokens);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      ACCESS,
      "access-1",
      opts,
    );
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      REFRESH,
      "refresh-1",
      opts,
    );
  });

  it("getAccessToken / getRefreshToken read their keys", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("v");
    await expect(keycloakService.getAccessToken()).resolves.toBe("v");
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith(ACCESS);
    await expect(keycloakService.getRefreshToken()).resolves.toBe("v");
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith(REFRESH);
  });

  it("clearTokens deletes both keys", async () => {
    await keycloakService.clearTokens();
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(ACCESS);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(REFRESH);
  });
});

describe("getCurrentUserId", () => {
  it("returns the decoded sub when an access token exists", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("access-1");
    (decodeToken as jest.Mock).mockReturnValue({
      id: "user-9",
      email: "a@b.com",
    });
    await expect(keycloakService.getCurrentUserId()).resolves.toBe("user-9");
  });

  it("returns null when there is no token (and never decodes)", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    await expect(keycloakService.getCurrentUserId()).resolves.toBeNull();
    expect(decodeToken).not.toHaveBeenCalled();
  });

  it("returns null when the token is present but cannot be decoded", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("bad-token");
    (decodeToken as jest.Mock).mockReturnValue(null);
    await expect(keycloakService.getCurrentUserId()).resolves.toBeNull();
  });
});

describe("refreshAccessToken", () => {
  const fakeRequest = {
    url: "https://api.test/token/refresh",
    init: { method: "POST" },
  };

  beforeEach(() => {
    (buildSigned as jest.Mock).mockResolvedValue(fakeRequest);
    globalThis.fetch = jest.fn();
  });

  it("returns null and skips the network when no refresh token is stored", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    await expect(keycloakService.refreshAccessToken()).resolves.toBeNull();
    expect(buildSigned).not.toHaveBeenCalled();
  });

  it("posts to AUTH_REFRESH, persists, and returns the new tokens", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("refresh-1");
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        accessToken: "access-2",
        refreshToken: "refresh-2",
        expiresIn: 300,
        tokenType: "Bearer",
      }),
    });

    const result = await keycloakService.refreshAccessToken();

    expect(buildSigned).toHaveBeenCalledWith(
      "POST",
      ENDPOINTS.AUTH_REFRESH,
      { refreshToken: "refresh-1" },
      false,
      false,
    );
    expect(globalThis.fetch).toHaveBeenCalledWith(
      fakeRequest.url,
      fakeRequest.init,
    );
    expect(result).toEqual({
      accessToken: "access-2",
      refreshToken: "refresh-2",
      expiresIn: 300,
      tokenType: "Bearer",
    });
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      ACCESS,
      "access-2",
      opts,
    );
  });

  it("keeps the stored refresh token when the response omits it", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("refresh-1");
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        accessToken: "access-2",
        refreshToken: null,
        expiresIn: 300,
        tokenType: "Bearer",
      }),
    });

    const result = await keycloakService.refreshAccessToken();
    expect(result?.refreshToken).toBe("refresh-1"); // coalesced from storage
  });

  it("returns null when the server rejects the refresh", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("refresh-1");
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue(null),
    });
    await expect(keycloakService.refreshAccessToken()).resolves.toBeNull();
  });

  it("returns null on a thrown error", async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("refresh-1");
    (globalThis.fetch as jest.Mock).mockRejectedValue(new Error("boom"));
    await expect(keycloakService.refreshAccessToken()).resolves.toBeNull();
  });
});

describe("getRedirectUri", () => {
  it("delegates to AuthSession.makeRedirectUri", () => {
    expect(keycloakService.getRedirectUri()).toBe("redirect://uri");
    expect(AuthSession.makeRedirectUri).toHaveBeenCalled();
  });
});
