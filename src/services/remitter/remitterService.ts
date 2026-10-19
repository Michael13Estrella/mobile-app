/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ENDPOINTS } from "../../constants/endpoints";
import { DashboardStatsResponse, RemitterGuidResponse } from "../../types";
import { apiClient } from "../api/apiClient";
import { keycloakService } from "../auth/keycloakService";
import { userStorageService } from "../storage/userStorageService";

export const remitterService = {
  /**
   * The remitterGuid of a user: from the device if saved, otherwise
   * fetched from the API and saved for next time
   *
   * @param kcId - The keycloak user id.
   * @returns The remitterGuid
   * @throws when it isn't saved and can't be fetched.
   */
  ensureRemitterGuid: async (kcId: string): Promise<string> => {
    const existing = await userStorageService.getRemitterGuid(kcId);
    if (existing) return existing;

    const { ok, data } = await apiClient.plain.get<RemitterGuidResponse>(
      ENDPOINTS.REMITTER_GUID(kcId),
    );

    if (!ok || !data?.remitterGuid) {
      throw new Error("Failed to fetch remitter guid");
    }

    await userStorageService.setRemitterGuid(kcId, data.remitterGuid);
    return data.remitterGuid;
  },

  /**
   * The signed-in user's remitterGuid, for API URLs.
   *
   * @returns The remitterGuid, or `null` without a session.
   * @throws When it isn't saved and can't be fetched.
   */
  getCurrentRemitterGuid: async (): Promise<string | null> => {
    const kcId = await keycloakService.getCurrentKcId();
    if (!kcId) return null;
    return remitterService.ensureRemitterGuid(kcId);
  },

  /**
   * Home dashboard: remitter profile, recent beneficiaries and transactions,
   * last login and wallet
   *
   * @returns The dashboardStatsResponse, or `null` when it couldn't be loaded (no
   * session, network or server error); the caller shows the error state.
   */
  fetchDashboardStats: async (): Promise<DashboardStatsResponse | null> => {
    try {
      const remitterGuid = await remitterService.getCurrentRemitterGuid();
      if (!remitterGuid) return null;

      const { ok, data } = await apiClient.critical.get<DashboardStatsResponse>(
        ENDPOINTS.REMITTER_DASHBOARD_STATS(remitterGuid),
      );
      return ok && data ? data : null;
    } catch {
      // ensureRemitterGuid throws when the guid can't be fetched
      return null;
    }
  },
};
