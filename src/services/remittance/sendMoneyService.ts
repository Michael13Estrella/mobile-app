/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-12
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ENDPOINTS } from "../../constants/endpoints";
import { SaveResult, SendMoneyRequest } from "../../types";
import { firstErrorMessage } from "../../utils/api/apiErrors";
import { apiClient } from "../api/apiClient";
import { remitterService } from "../remitter/remitterService";

export const sendMoneyService = {
  /**
   * Sends a remittance (after the remitter was verified).
   *
   * @param request - The body, from buildSendMoneyRequest
   * @returns `{ ok: true }` when sent; otherwise `ok: false`, with the
   *   server's first error message
   */
  sendMoney: async (request: SendMoneyRequest): Promise<SaveResult> => {
    try {
      const remitterGuid = await remitterService.getCurrentRemitterGuid();
      if (!remitterGuid) return { ok: false };

      const { ok, errors } = await apiClient.encrypt.post(
        ENDPOINTS.SEND_MONEY_ENCRYPT(remitterGuid),
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
};
