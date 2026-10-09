/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-30
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { apiClient } from "../api/apiClient";
import { ENDPOINTS } from "../../constants/endpoints";
import { store } from "../../store";
import { deviceService } from "../security/deviceService";
import { userStorageService } from "../storage/userStorageService";

// Foreground display behavior (banner + sound while app is open)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// projectId comes from EAS config - never hardcode it.
const projectId =
  Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

export const notificationService = {
  // Ask permission + return an Expo push token (null if denied / not a real device)
  registerForPushToken: async (): Promise<string | null> => {
    if (!Device.isDevice && !__DEV__) return null; // allow emulators in dev, still require a real device in production

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let status = existing;
    if (existing !== "granted") {
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== "granted") return null;

    try {
      const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
      if (__DEV__) console.log("[push] token:", data);
      return data; // e.g. "ExponentPushToken[xxxx]"
    } catch (e) {
      if (__DEV__) console.log("[push] getExpoPushTokenAsync FAILED:", e);
      return null;
    }
  },

  // Register the token with the backend (ties it to the enrolled device/user)
  syncToken: async (token: string): Promise<void> => {
    const kcId = store.getState().auth.user?.id;
    if (!kcId) return;

    const remitterGuid = await userStorageService.getRemitterGuid(kcId);
    if (!remitterGuid) return;

    const deviceid = await deviceService.getDeviceId();
    if (!deviceid) return;

    const res = await apiClient.dbrs.post(
      ENDPOINTS.NOTIFICATION_REGISTER(remitterGuid),
      {
        deviceid: deviceid,
        expoPushToken: token,
      },
    );
    if (__DEV__) console.log("[push] register ->", res.status, res.ok);
  },

  // Clear this device's token on the backend (called on logout).
  unregister: async (kcId: string): Promise<void> => {
    const remitterGuid = await userStorageService.getRemitterGuid(kcId);
    if (!remitterGuid) return;

    const deviceid = await deviceService.getDeviceId();
    if (!deviceid) return;

    await apiClient.dbrs.post(ENDPOINTS.NOTIFICATION_UNREGISTER(remitterGuid), {
      deviceid: deviceid,
    });
  },
};
