/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-14
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ENDPOINTS } from "../../constants/endpoints";
import { ChargeTier } from "../../types";
import { apiClient } from "../api/apiClient";

export const chargeService = {
  // Service charge tiers (reference data, same security as the other
  // reference-master calls). Empty when they couldn't be loaded.
  fetchCharges: async (): Promise<ChargeTier[]> => {
    const { ok, data } = await apiClient.plain.get<ChargeTier[]>(
      ENDPOINTS.REFERENCE_CHARGES,
    );
    return ok && data ? data : [];
  },
};
