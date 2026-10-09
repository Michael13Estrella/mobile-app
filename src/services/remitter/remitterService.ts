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
import { DashboardStatsResponse } from "../../types";
import { apiClient } from "../api/apiClient";
import { keycloakService } from "../auth/keycloakService";
import { deviceEnrollmentService } from "../security/deviceEnrollmentService";

// The signed-in user's remitterGuid (cached on the device after the first fetch).
const getRemitterGuid = async (): Promise<string | null> => {
  const kcId = await keycloakService.getCurrentKcId();
  if (!kcId) return null;
  return deviceEnrollmentService.ensureRemitterGuid(kcId);
};

export const remitterService = {
  // Home dashboard: remitter profile, recent beneficiaries and transactions,
  // last login and wallet. null when it couldn't be loaded (no session,
  // network or server error); the caller shows the error state.
  fetchDashboardStats: async (): Promise<DashboardStatsResponse | null> => {
    try {
      const remitterGuid = await getRemitterGuid();
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
