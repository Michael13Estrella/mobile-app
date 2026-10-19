/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-19
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ENDPOINTS } from "../../constants/endpoints";
import { ManageBeneficiariesResponse } from "../../types";
import { apiClient } from "../api/apiClient";
import { remitterService } from "../remitter/remitterService";

export const beneficiaryService = {
  /**
   * The remitter's saved beneficiaries, grouped as own accounts,
   * individuals and corporate.
   *
   * @returns The lists, or `null` when they could not be loaded (no session,
   * network or server error); the caller shows the error state.
   */
  fetchBeneficiaries: async (): Promise<ManageBeneficiariesResponse | null> => {
    try {
      const remitterGuid = await remitterService.getCurrentRemitterGuid();
      if (!remitterGuid) return null;

      const { ok, data } =
        await apiClient.critical.get<ManageBeneficiariesResponse>(
          ENDPOINTS.MANAGE_BENEFICIARIES(remitterGuid),
        );

      return ok && data ? data : null;
    } catch {
      // GetCurrentRemitterGuid throws when the guid can't be fetched
      return null;
    }
  },
};
