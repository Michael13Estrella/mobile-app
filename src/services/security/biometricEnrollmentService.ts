/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-23
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ENDPOINTS } from "../../constants/endpoints";
import {
  BiometricEnrollRequest,
  ChallengeResponse,
  StatusResponse,
} from "../../types";
import { apiClient } from "../api/apiClient";
import { userService } from "../user/userService";
import { biometricService } from "./biometricService";

export const biometricEnrollment = {
  // userId only - apiClient pulls the access token itself via keycloakService.
  enroll: async (userId: string, promptMessage: string): Promise<void> => {
    const publicKey = await biometricService.createKey(userId);
    try {
      const challengeRes = await apiClient.dbrs.post<ChallengeResponse>(
        ENDPOINTS.BIOMETRIC_CHALLENGE,
      );

      if (__DEV__) console.log("ChallengeRes: ", challengeRes);

      if (!challengeRes.ok || !challengeRes.data) {
        throw new Error("Failed to get challenge");
      }

      const { challenge } = challengeRes.data;

      const signature = await biometricService.getAssertion(
        challenge,
        promptMessage,
      );

      const remitterGuid = await userService.getRemitterGuid(userId);
      if (!remitterGuid) {
        throw new Error("Missing remitter guid");
      }

      const body: BiometricEnrollRequest = { publicKey, challenge, signature };
      const biometricEnrollmentRes =
        await apiClient.critical.post<StatusResponse>(
          ENDPOINTS.BIOMETRIC_ENROLL(remitterGuid),
          body,
        );

      if (__DEV__)
        console.log("biometricEnrollmentRes: ", biometricEnrollmentRes);

      if (!biometricEnrollmentRes.ok)
        throw new Error("Biometric enrollment failed");

      await biometricService.setEnabled(userId, true);
    } catch (e) {
      await biometricService.disable(userId); // rollback orphan key on cancel/failure
      throw e;
    }
  },
};
