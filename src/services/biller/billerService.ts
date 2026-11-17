/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ENDPOINTS } from "../../constants/endpoints";
import {
  AddBillerRequest,
  EnrolledBiller,
  ManageBillersResponse,
  SaveResult,
} from "../../types";
import { firstErrorMessage } from "../../utils/api/apiErrors";
import { apiClient } from "../api/apiClient";
import { remitterService } from "../remitter/remitterService";

export const billerService = {
  /**
   * Enrolls a biller: saved as a beneficiary with a bills payment payout
   * (the Create Beneficiary endpoint).
   *
   * @param request - The body, from buildAddBillerRequest
   * @returns ok, or the server's first error message when there is one
   */
  addBiller: async (request: AddBillerRequest): Promise<SaveResult> => {
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
   * The remitter's enrolled billers.
   *
   * @returns The billers, or `null` when they couldn't be loaded (no
   *    session, network or server error); the screen shows the error
   */
  fetchEnrolledBillers: async (): Promise<EnrolledBiller[] | null> => {
    try {
      const remitterGuid = await remitterService.getCurrentRemitterGuid();
      if (!remitterGuid) return null;

      const { ok, data } = await apiClient.critical.get<ManageBillersResponse>(
        ENDPOINTS.MANAGE_BILLERS(remitterGuid),
      );
      return ok && data ? data.billers : null;
    } catch {
      // getCurrentRemitterGuid throws when the guid can't be fetched
      return null;
    }
  },

  /**
   * Deletes an enrolled biller (a beneficiary: the Delete Beneficiary
   * endpoint).
   *
   * @param beneficiaryGuid - The biller to delete
   * @returns ok, or the server's first error message when there is one
   */
  deleteBiller: async (beneficiaryGuid: string): Promise<SaveResult> => {
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
      // getCurrentRemitterGuid throws when the guid can't be fetched
      return { ok: false };
    }
  },
};
