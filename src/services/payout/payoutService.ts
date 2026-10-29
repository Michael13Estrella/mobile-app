/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-29
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ENDPOINTS } from "../../constants/endpoints";
import { CreatePayoutRequest, SaveResult } from "../../types";
import { firstErrorMessage } from "../../utils/api/apiErrors";
import { apiClient } from "../api/apiClient";
import { remitterService } from "../remitter/remitterService";

export const payoutService = {
  /**
   * Saves a new payout method for a saved beneficiary.
   *
   * @param beneficiaryGuid - The beneficiary to add it to
   * @param request - The payout (only the fields of its type)
   * @returns `{ ok: true }` when saved; otherwise `ok: false`, with the
   * server's first error message
   */
  addPayout: async (
    beneficiaryGuid: string,
    request: CreatePayoutRequest,
  ): Promise<SaveResult> => {
    try {
      const remitterGuid = await remitterService.getCurrentRemitterGuid();
      if (!remitterGuid) return { ok: false };

      const { ok, errors } = await apiClient.critical.post(
        ENDPOINTS.ADD_PAYOUT(remitterGuid, beneficiaryGuid),
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
   * Deletes one of a saved beneficiary's payout methods.
   *
   * @param beneficiaryGuid - The beneficiary it belongs to
   * @param payoutId - The payout method to delete
   * @returns `{ ok: true }` when deleted; otherwise `ok: false`, with the
   * server's first error message
   */
  deletePayout: async (
    beneficiaryGuid: string,
    payoutId: number,
  ): Promise<SaveResult> => {
    try {
      const remitterGuid = await remitterService.getCurrentRemitterGuid();
      if (!remitterGuid) return { ok: false };

      const { ok, errors } = await apiClient.critical.delete(
        ENDPOINTS.DELETE_PAYOUT(remitterGuid, beneficiaryGuid, payoutId),
      );

      return ok
        ? { ok: true }
        : { ok: false, message: firstErrorMessage(errors) };
    } catch {
      return { ok: false };
    }
  },
};
