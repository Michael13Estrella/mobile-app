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
  CreateBeneficiaryRequest,
  ManageBeneficiariesResponse,
  SaveResult,
} from "../../types";
import { firstErrorMessage } from "../../utils/api/apiErrors";
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

  /**
   * Saves a new beneficiary together with its first payout method.
   *
   * @param request - The beneficiary and the payout (only the fields of their types)
   * @returns `{ ok: true }` when saved; otherwise `ok: false`, with the
   * server's first error message
   */
  createBeneficiary: async (
    request: CreateBeneficiaryRequest,
  ): Promise<SaveResult> => {
    try {
      const remitterGuid = await remitterService.getCurrentRemitterGuid();
      if (!remitterGuid) return { ok: false };

      const { ok, errors } = await apiClient.critical.post(
        ENDPOINTS.CREATE_BENEFICIARY(remitterGuid),
        request,
      );

      return ok
        ? { ok: true }
        : { ok: false, message: firstErrorMessage(errors) };
    } catch {
      // getCurrentRemitterGuid throws when the guid can't be fetched
      return { ok: false };
    }
  },

  /**
   * Deletes a saved beneficiary, with its payout methods.
   *
   * @param beneficiaryGuid - The beneficiary to delete
   * @returns `{ ok: true }` when deleted; otherwise `ok: false`, with the
   * server's first error message
   */
  deleteBeneficiary: async (beneficiaryGuid: string): Promise<SaveResult> => {
    try {
      const remitterGuid = await remitterService.getCurrentRemitterGuid();
      if (!remitterGuid) return { ok: false };

      const { ok, errors } = await apiClient.critical.delete(
        ENDPOINTS.DELETE_BENEFICIARY(remitterGuid, beneficiaryGuid),
      );

      return ok
        ? { ok: true }
        : { ok: false, message: firstErrorMessage(errors) };
    } catch {
      return { ok: false };
    }
  },
};
