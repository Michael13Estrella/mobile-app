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
import { SECURITY } from "../../constants/security";
import QuickCrypto from "react-native-quick-crypto";
import {
  encryptBodyGcm,
  hmacSha256Base64,
  signEcdsaBase64,
} from "../../utils/crypto";
import { Platform } from "react-native";
import { DeviceEnrollRequest, DeviceOs } from "../../types";
import { buildUserKey } from "../../utils/secureStoreKeys";
import { store } from "../../store";

const KEYS = SECURITY.STORE_KEYS;

export const deviceService = {
  isEnrolled: async (): Promise<boolean> => {
    return (await SecureStore.getItemAsync(KEYS.DEVICE_ID)) !== null;
  },

  prepareEnrollment: async (): Promise<DeviceEnrollRequest> => {
    const deviceOs = Platform.OS === "ios" ? DeviceOs.iOS : DeviceOs.Android;
    const lang = store.getState().ui.locale;

    const existing = await SecureStore.getItemAsync(KEYS.DEVICE_PUBLIC);
    if (existing) return { dbrsPublicKey: existing, deviceOs, lang };

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
      deviceOs,
      lang,
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
    await SecureStore.setItemAsync(KEYS.DEVICE_ID, deviceId);
    await SecureStore.setItemAsync(KEYS.HMAC_KEY, hmacKeyBase64);
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
