/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { ENDPOINTS } from "../../constants/endpoints";
import { SECURITY } from "../../constants/security";
import { DeviceEnrollRequest, DeviceEnrollResponse } from "../../types";
import { Language } from "../../types/language.types";
import { buildUserKey } from "../../utils/security/secureStoreKeys";
import { apiClient } from "../api/apiClient";
import { remitterService } from "../remitter/remitterService";
import { deviceService } from "./deviceService";
import * as SecureStore from "expo-secure-store";

const enrolledKey = (kcId: string) =>
  buildUserKey(SECURITY.STORE_KEYS.ENROLLED_PREFIX, kcId);

export const deviceEnrollmentService = {
  isUserEnrolled: async (kcId: string): Promise<boolean> => {
    if ((await SecureStore.getItemAsync(enrolledKey(kcId))) === "true") {
      return true;
    }
    return false;
  },

  getUserEnrolledKey: async (kcId: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(enrolledKey(kcId));
  },

  ensureEnrolled: async (kcId: string): Promise<void> => {
    if (await deviceEnrollmentService.isUserEnrolled(kcId)) return;

    const remitterGuid = await remitterService.ensureRemitterGuid(kcId);

    const { dbrsPublicKey, deviceOs, lang } =
      await deviceService.prepareEnrollment();

    const body: DeviceEnrollRequest = { dbrsPublicKey, deviceOs, lang };
    const { ok, data, status } =
      await apiClient.plain.post<DeviceEnrollResponse>(
        ENDPOINTS.DEVICE_ENROLL(remitterGuid!),
        body,
      );

    if (__DEV__) {
      console.log("DeviceEnrollmentBody: ", body);
      console.log(`Device enrollment: OK=${ok}, STATUS:${status}`);
      console.log("Data: ", data);
    }

    if (!ok || !data) {
      if (__DEV__) console.log("Enrollment failed");
      throw new Error("Device enrollment failed");
    }

    if (!(await deviceService.getDeviceId())) {
      await deviceService.completeEnrollment(data.deviceId, data.hmacKey);
    }

    await SecureStore.setItemAsync(enrolledKey(kcId), "true");
  },

  setLanguage: async (lang: Language): Promise<void> => {
    await apiClient.dbrs.put(ENDPOINTS.DEVICE_LANGUAGE, { language: lang });
  },
};
