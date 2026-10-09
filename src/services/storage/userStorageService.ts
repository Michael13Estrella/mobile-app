/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import * as SecureStore from "expo-secure-store";
import { SECURITY } from "../../constants/security";
import { buildUserKey } from "../../utils/secureStoreKeys";

const K = SECURITY.STORE_KEYS;

// Same protection for every value: only readable while the phone is
// unlocked, never synced to other devices or included in backups.
const opts = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

const remitterGuidKey = (kcId: string) =>
  buildUserKey(K.REMITTER_GUID_PREFIX, kcId);

const displayNameKey = (kcId: string) =>
  buildUserKey(K.DISPLAY_NAME_PREFIX, kcId);

// Small per-user values kept on the device between launches (keyed by the
// Keycloak user id, so each user on the phone has their own).
export const userStorageService = {
  getRemitterGuid: (kcId: string): Promise<string | null> =>
    SecureStore.getItemAsync(remitterGuidKey(kcId), opts),

  setRemitterGuid: (kcId: string, remitterGuid: string): Promise<void> =>
    SecureStore.setItemAsync(remitterGuidKey(kcId), remitterGuid, opts),

  // Display name for the lock screen greeting: the lock screen can't call
  // the API (the user is not unlocked yet), so the last known name is kept
  getDisplayName: (kcId: string): Promise<string | null> =>
    SecureStore.getItemAsync(displayNameKey(kcId), opts),

  setDisplayName: (kcId: string, displayName: string): Promise<void> =>
    SecureStore.setItemAsync(displayNameKey(kcId), displayName, opts),

  clearDisplayName: (kcId: string): Promise<void> =>
    SecureStore.deleteItemAsync(displayNameKey(kcId), opts),
};
