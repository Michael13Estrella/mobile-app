/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-07-17
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
const remitterGuidKey = (kcId: string) =>
  buildUserKey(K.REMITTER_GUID_PREFIX, kcId);

const opts = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

export const userService = {
  isRemitterGuidSet: async (kcId: string): Promise<boolean> =>
    (await SecureStore.getItemAsync(remitterGuidKey(kcId))) !== null,

  setRemitterGuid: async (
    kcId: string,
    remitterGuid: string,
  ): Promise<void> => {
    await SecureStore.setItemAsync(remitterGuidKey(kcId), remitterGuid);
  },

  getRemitterGuid: async (kcId: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(remitterGuidKey(kcId), opts);
  },
};
