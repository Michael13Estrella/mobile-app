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
import {
  BeneficiaryPayoutsResponse,
  ManageBeneficiariesResponse,
} from "../../types";
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

  /**
   * One beneficiary's details and payout methods
   *
   * @param beneficiaryGuid - The beneficiary to load
   * @returns The details and payouts, or `null` when they couldn't be loaded
   *    (no session, network or server error)
   */
  fetchBeneficiaryPayouts: async (
    beneficiaryGuid: string,
  ): Promise<BeneficiaryPayoutsResponse | null> => {
    try {
      const remitterGuid = await remitterService.getCurrentRemitterGuid();
      if (!remitterGuid) return null;

      const { ok, data } =
        await apiClient.critical.get<BeneficiaryPayoutsResponse>(
          ENDPOINTS.BENEFICIARY_PAYOUTS(remitterGuid, beneficiaryGuid),
        );
      return ok && data ? data : null;
    } catch {
      // getCurrentRemitterGuid throws when the guid can't be fetched
      return null;
    }
  },
};
