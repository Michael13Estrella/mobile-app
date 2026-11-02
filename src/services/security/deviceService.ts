/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-15
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import * as SecureStore from "expo-secure-store";
import * as Application from "expo-application";
import { SECURITY } from "../../constants/security";
import QuickCrypto from "react-native-quick-crypto";
import {
  encryptBodyGcm,
  hmacSha256Base64,
  signEcdsaBase64,
} from "../../utils/security/crypto";
import { Platform } from "react-native";
import { DeviceEnrollRequest, DeviceOs } from "../../types";
import { buildUserKey } from "../../utils/security/secureStoreKeys";
import { store } from "../../store";
import * as Device from "expo-device";

const KEYS = SECURITY.STORE_KEYS;

const opts = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

// Every value a request needs. HARDWARE_ID isn't one: it must outlive re-enrollment
const IDENTITY_KEYS = [
  KEYS.DEVICE_PRIVATE,
  KEYS.DEVICE_PUBLIC,
  KEYS.DEVICE_ID,
  KEYS.HMAC_KEY,
];

export const deviceService = {
  hasCompleteIdentity: async (): Promise<boolean> => {
    const values = await Promise.all(
      IDENTITY_KEYS.map((key) => SecureStore.getItemAsync(key)),
    );
    return values.every((value) => value !== null);
  },

  clearIdentity: async (): Promise<void> => {
    await Promise.all(
      IDENTITY_KEYS.map((key) => SecureStore.deleteItemAsync(key)),
    );
  },

  /**
   * A unique ID for this phone (App Key registration) that stays the same
   * when the app is reinstalled. Android: ANDROID_ID. iOS: a random ID made
   * once and kept in the keychain (which survives reinstalling and, being
   * THIS_DEVICE_ONLY, never moves to another phone through a backup).
   *
   * @returns The ID (Android: hex string; iOS: UUID)
   */
  getHardwareId: async (): Promise<string> => {
    if (Platform.OS === "android") return Application.getAndroidId();

    const existing = await SecureStore.getItemAsync(KEYS.HARDWARE_ID);
    if (existing) return existing;

    const created = QuickCrypto.randomUUID();
    await SecureStore.setItemAsync(KEYS.HARDWARE_ID, created, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });

    return created;
  },

  prepareEnrollment: async (): Promise<DeviceEnrollRequest> => {
    const deviceInfo = {
      deviceOs: Platform.OS === "ios" ? DeviceOs.iOS : DeviceOs.Android,
      lang: store.getState().ui.locale,
      deviceName: Device.modelName ?? undefined,
      hardwareId: await deviceService.getHardwareId(),
    };

    const existing = await SecureStore.getItemAsync(KEYS.DEVICE_PUBLIC);
    if (existing) return { dbrsPublicKey: existing, ...deviceInfo };

    const { privateKey, publicKey } = QuickCrypto.generateKeyPairSync("ec", {
      namedCurve: "P-256",
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    if (__DEV__) {
      console.log("dbrsPrivateKey: ", privateKey);
      console.log("dbrsPublicKey: ", publicKey);
    }

    await SecureStore.setItemAsync(KEYS.DEVICE_PRIVATE, privateKey as string, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
    await SecureStore.setItemAsync(KEYS.DEVICE_PUBLIC, publicKey as string, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });

    return {
      dbrsPublicKey: publicKey as string,
      ...deviceInfo,
    };
  },

  completeEnrollment: async (
    deviceId: string,
    hmacKeyBase64: string,
  ): Promise<void> => {
    if (__DEV__) {
      console.log("deviceId: ", deviceId);
      console.log("hmacKeyBase64: ", hmacKeyBase64);
    }
    await SecureStore.setItemAsync(KEYS.DEVICE_ID, deviceId, opts);
    await SecureStore.setItemAsync(KEYS.HMAC_KEY, hmacKeyBase64, opts);
  },

  getDeviceId: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(KEYS.DEVICE_ID);
  },

  // temporary
  getDevicePrivate: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(KEYS.DEVICE_PRIVATE);
  },
  getDevicePublic: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(KEYS.DEVICE_PUBLIC);
  },

  signRequest: async (descriptor: string): Promise<string> => {
    const pem = await SecureStore.getItemAsync(KEYS.DEVICE_PRIVATE);

    if (!pem) throw new Error("Device not enrolled");

    return signEcdsaBase64(pem, descriptor);
  },

  signHmac: async (data: string): Promise<string> => {
    const key = await SecureStore.getItemAsync(KEYS.HMAC_KEY);
    if (!key) throw new Error("HMAC key missing");

    return hmacSha256Base64(key, data);
  },

  encryptBody: async (plaintext: string, nonce: string) => {
    const key = await SecureStore.getItemAsync(KEYS.HMAC_KEY);
    if (!key) throw new Error("HMAC key missing");

    return encryptBodyGcm(key, plaintext, nonce);
  },

  clear: async (userId: string): Promise<void> => {
    const literalKeys = [
      KEYS.DEVICE_PRIVATE,
      KEYS.DEVICE_PUBLIC,
      KEYS.DEVICE_ID,
      KEYS.HMAC_KEY,
      KEYS.BIOMETRIC_ACTIVE_USER,
    ];

    const perUserKeys = [
      KEYS.ENROLLED_PREFIX,
      KEYS.BIOMETRIC_ENABLED_PREFIX,
      KEYS.BIOMETRIC_REPROMPT_PREFIX,
      KEYS.PIN_HASH_PREFIX,
      KEYS.PIN_ATTEMPTS_PREFIX,
      KEYS.REMITTER_GUID_PREFIX,
    ].map((prefix) => buildUserKey(prefix, userId));

    await Promise.all(
      [...literalKeys, ...perUserKeys].map((k) =>
        SecureStore.deleteItemAsync(k),
      ),
    );
  },
};
