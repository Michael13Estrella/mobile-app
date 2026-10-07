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

import ReactNativeBiometrics, { BiometryType } from "react-native-biometrics";
import * as SecureStore from "expo-secure-store";
import { SECURITY } from "../../constants/security";
import { buildUserKey } from "../../utils/secureStoreKeys";

// allowDeviceCredentials:false => biometric ONLY (no passcode fallback) = high assurance.
// FLip to true only if you intentionally accept device PIN/passcode as an equal factor.

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: false,
});

const K = SECURITY.STORE_KEYS;

const enabledKey = (kcId: string) =>
  buildUserKey(K.BIOMETRIC_ENABLED_PREFIX, kcId);

const repromptKey = (kcId: string) =>
  buildUserKey(K.BIOMETRIC_REPROMPT_PREFIX, kcId);

const ACTIVE_USER_KEY = SECURITY.STORE_KEYS.BIOMETRIC_ACTIVE_USER;

const opts = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

export interface BiometricCapability {
  available: boolean;
  biometryType?: BiometryType;
}

export const biometricService = {
  // --- capability ---
  isAvailable: async (): Promise<BiometricCapability> => {
    const res = await rnBiometrics.isSensorAvailable();
    if (__DEV__) console.log("[bio] isSensorAvailable:", res);
    return { available: res.available, biometryType: res.biometryType };
  },

  // --- key custody ---
  hasKeys: async (): Promise<boolean> => {
    const { keysExist } = await rnBiometrics.biometricKeysExist();
    return keysExist;
  },

  // Triggers the biometric prompt and signs `challenge`.
  // Reused for enroll, login, AND step-up. Throws on cancel/failure/key-invalidation
  // so the caller can fall back to OIDC. promptMessage comes from the caller (i18n).
  getAssertion: async (
    challenge: string,
    promptMessage: string,
  ): Promise<string> => {
    const { success, signature, error } = await rnBiometrics.createSignature({
      promptMessage,
      payload: challenge,
    });

    if (!success || !signature) {
      throw new Error(error ?? "Biometric authentication failed");
    }

    return signature;
  },

  // --- per-user preference flag (UX only) ---
  isEnabled: async (userId: string): Promise<boolean> => {
    return (await SecureStore.getItemAsync(enabledKey(userId))) === "true";
  },

  setEnabled: async (userId: string, enabled: boolean): Promise<void> => {
    if (enabled) {
      await SecureStore.setItemAsync(enabledKey(userId), "true", opts);
    } else {
      await SecureStore.deleteItemAsync(enabledKey(userId));
    }
  },

  // --- which user owns the single hardware key ---
  getActiveUser: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(ACTIVE_USER_KEY);
  },

  // Generates the biometric-bound key-pair AND claims ownership for this user.
  // Returns the public key (base64 DER) to register with the backend.
  // The private key is created inside Keystore/Secure Enclave and never leaves it.
  createKey: async (userId: string): Promise<string> => {
    if (await biometricService.hasKeys()) {
      await rnBiometrics.deleteKeys(); // clean rotation on re-enroll
    }

    const { publicKey } = await rnBiometrics.createKeys();
    await SecureStore.setItemAsync(ACTIVE_USER_KEY, userId, opts);
    return publicKey;
  },

  // True only when this user has opted in AND owns the live hardware key
  canUseBiometricLogin: async (userId: string): Promise<boolean> => {
    const { available } = await biometricService.isAvailable();
    return (
      available &&
      (await biometricService.isEnabled(userId)) &&
      (await biometricService.hasKeys()) &&
      (await biometricService.getActiveUser()) === userId
    );
  },

  // User backed out of the prompt
  isUserCancel: (error: unknown): boolean => {
    const msg = String((error as Error)?.message ?? error).toLowerCase();
    return msg.includes("cancel"); // iOS "User cancelled", Android "Cancel"/"cancelled"
  },

  // Best-effort classification of a createSignature failure as "key invalidated"
  isKeyInvalidated: (error: unknown): boolean => {
    const msg = String((error as Error)?.message ?? error).toLowerCase();
    return (
      msg.includes("keypermanentlyinvalidated") ||
      msg.includes("permanently_invalidated") ||
      msg.includes("invalidated")
    );
  },

  // Set-change detected -> wipe everything for this user AND clear the "prompted" flag
  // so the next OIDC login re-offers enrollment.
  handleInvalidation: async (kcId: string): Promise<void> => {
    await biometricService.disable(kcId); // delete key + clear enabled + active-user
    await SecureStore.setItemAsync(repromptKey(kcId), "true", opts);
  },

  needsReprompt: async (kcId: string): Promise<boolean> => {
    return (await SecureStore.getItemAsync(repromptKey(kcId))) === "true";
  },

  clearReprompt: async (kcId: string): Promise<void> => {
    await SecureStore.deleteItemAsync(repromptKey(kcId));
  },

  // --- teardown (logout / disable) ---
  disable: async (userId: string): Promise<void> => {
    await biometricService.setEnabled(userId, false);
    if ((await biometricService.getActiveUser()) === userId) {
      if (await biometricService.hasKeys()) {
        await rnBiometrics.deleteKeys();
      }
      await SecureStore.deleteItemAsync(ACTIVE_USER_KEY);
    }
  },

  // DEV: unconditionally remove the biometric hardware key.
  wipeKeys: async (): Promise<void> => {
    if (await biometricService.hasKeys()) {
      await rnBiometrics.deleteKeys();
    }
  },
};
