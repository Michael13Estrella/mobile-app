/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-29
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { store } from "../../../store";
import { isTokenExpired } from "../../../utils/tokenUtils";
import { keycloakService } from "../../auth/keycloakService";
import { tokenService } from "../../auth/tokenService";
import { apiClient } from "../apiClient";
import { request as transportRequest } from "../apiTransport";

jest.mock("../../auth/tokenService", () => ({
  tokenService: { getAccessToken: jest.fn() },
}));

jest.mock("../../auth/keycloakService", () => ({
  keycloakService: { refreshAccessToken: jest.fn() },
}));

jest.mock("../../../utils/tokenUtils", () => ({
  isTokenExpired: jest.fn(),
}));

jest.mock("../../../store", () => ({
  store: { getState: jest.fn() },
}));

jest.mock("../apiTransport", () => ({
  request: jest.fn(),
}));

const lockedState = (isLocked: boolean) => ({ ui: { isLocked } });

beforeEach(() => {
  jest.clearAllMocks();
  (store.getState as jest.Mock).mockReturnValue(lockedState(false));
  (transportRequest as jest.Mock).mockResolvedValue({
    ok: true,
    status: 200,
    data: null,
  });
});

describe("apiClient gate", () => {
  it("proceeds without refreshing when there is no stored token (logged out)", async () => {
    (tokenService.getAccessToken as jest.Mock).mockResolvedValue(null);

    await apiClient.plain.get("/x");

    expect(keycloakService.refreshAccessToken).not.toHaveBeenCalled();
    expect(transportRequest).toHaveBeenCalledWith(
      "GET",
      "/x",
      undefined,
      "plain",
    );
  });

  it("proceeds without refreshing when the token is still valid", async () => {
    (tokenService.getAccessToken as jest.Mock).mockResolvedValue("valid-token");
    (isTokenExpired as jest.Mock).mockReturnValue(false);

    await apiClient.dbrs.post("/pay", { amount: 1 });

    expect(keycloakService.refreshAccessToken).not.toHaveBeenCalled();
    expect(transportRequest).toHaveBeenCalledWith(
      "POST",
      "/pay",
      { amount: 1 },
      "dbrs",
    );
  });

  it("refreshes once before proceeding when the token is expired and not locked", async () => {
    (tokenService.getAccessToken as jest.Mock).mockResolvedValue("stale-token");
    (isTokenExpired as jest.Mock).mockReturnValue(true);
    (store.getState as jest.Mock).mockReturnValue(lockedState(false));
    (keycloakService.refreshAccessToken as jest.Mock).mockResolvedValue({
      accessToken: "fresh-token",
      refreshToken: "r",
      expiresIn: 300,
      tokenType: "Bearer",
    });

    await apiClient.critical.get("/y");

    expect(keycloakService.refreshAccessToken).toHaveBeenCalledTimes(1);
    expect(transportRequest).toHaveBeenCalledWith(
      "GET",
      "/y",
      undefined,
      "critical",
    );
  });

  it("does NOT refresh when already locked - lets the call proceed with the stale token", async () => {
    (tokenService.getAccessToken as jest.Mock).mockResolvedValue("stale-token");
    (isTokenExpired as jest.Mock).mockReturnValue(true);
    (store.getState as jest.Mock).mockReturnValue(lockedState(true));

    await apiClient.plain.get("/z");

    expect(keycloakService.refreshAccessToken).not.toHaveBeenCalled();
    expect(transportRequest).toHaveBeenCalledWith(
      "GET",
      "/z",
      undefined,
      "plain",
    );
  });

  it("coalesces concurrent calls into a single refresh", async () => {
    (tokenService.getAccessToken as jest.Mock).mockResolvedValue("stale-token");
    (isTokenExpired as jest.Mock).mockReturnValue(true);
    (store.getState as jest.Mock).mockReturnValue(lockedState(false));

    let resolveRefresh!: (v: unknown) => void;
    (keycloakService.refreshAccessToken as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveRefresh = resolve;
      }),
    );

    const call1 = apiClient.plain.get("/a");
    const call2 = apiClient.plain.get("/b");

    resolveRefresh({
      accessToken: "fresh-token",
      refreshToken: "r",
      expiresIn: 300,
      tokenType: "Bearer",
    });
    await Promise.all([call1, call2]);

    expect(keycloakService.refreshAccessToken).toHaveBeenCalledTimes(1);
  });
});
