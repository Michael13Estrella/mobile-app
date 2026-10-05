import * as SecureStore from "expo-secure-store";
import { SECURITY } from "../../constants/security";
import { keycloakService } from "../auth/keycloakService";
import { biometricService } from "./biometricService";
import { ENDPOINTS } from "../../constants/endpoints";
import { apiClient } from "../api/apiClient";

// DEV ONLY: wipe all local credentials so the app behaves like a fresh install.
// Pass the userIds whose per-user flags should also be cleared (at minimum the current user).
export const devReset = async (kcIds: string[] = []): Promise<void> => {
  const KEYS = SECURITY.STORE_KEYS;

  try {
    await apiClient.plain.post(ENDPOINTS.DEBUG_RESET);
  } catch (e) {
    if (__DEV__) console.log("Backend reset skipped:", e);
  }

  // Fixed device identity + active-key pointer
  await Promise.all([
    SecureStore.deleteItemAsync(KEYS.DEVICE_PRIVATE),
    SecureStore.deleteItemAsync(KEYS.DEVICE_PUBLIC),
    SecureStore.deleteItemAsync(KEYS.DEVICE_ID),
    SecureStore.deleteItemAsync(KEYS.HMAC_KEY),
    SecureStore.deleteItemAsync(KEYS.BIOMETRIC_ACTIVE_USER),
  ]);

  // Per-user flags (prefixes need the userId to target the exact stored key)
  await Promise.all(
    kcIds.flatMap((kcId) => [
      SecureStore.deleteItemAsync(`${KEYS.ENROLLED_PREFIX}${kcId}`),
      SecureStore.deleteItemAsync(`${KEYS.BIOMETRIC_ENABLED_PREFIX}${kcId}`),
      SecureStore.deleteItemAsync(`${KEYS.PIN_HASH_PREFIX}${kcId}`),
      SecureStore.deleteItemAsync(`${KEYS.PIN_ATTEMPTS_PREFIX}${kcId}`),
      SecureStore.deleteItemAsync(`${KEYS.REMITTER_GUID_PREFIX}${kcId}`),
    ]),
  );

  await keycloakService.clearTokens(); // reuse, don't hardcode token key names
  await biometricService.wipeKeys();
};
