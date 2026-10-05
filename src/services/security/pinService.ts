import * as SecureStore from "expo-secure-store";
import bcrypt from "bcryptjs";
import QuickCrypto from "react-native-quick-crypto";
import { SECURITY } from "../../constants/security";
import { buildUserKey } from "../../utils/secureStoreKeys";

bcrypt.setRandomFallback((len) => Array.from(QuickCrypto.randomBytes(len)));

const K = SECURITY.STORE_KEYS;
const hashKey = (kcId: string) => buildUserKey(K.PIN_HASH_PREFIX, kcId);
const attemptsKey = (kcId: string) => buildUserKey(K.PIN_ATTEMPTS_PREFIX, kcId);
const MAX_ATTEMPTS = SECURITY.PIN.MAX_ATTEMPTS;
const ROUNDS = SECURITY.PIN.BCRYPT_ROUNDS;
const opts = { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY };

export const pinService = {
  isSet: async (kcId: string): Promise<boolean> =>
    (await SecureStore.getItemAsync(hashKey(kcId))) !== null,

  set: async (kcId: string, pin: string): Promise<void> => {
    const hash = await bcrypt.hash(pin, ROUNDS);
    await SecureStore.setItemAsync(hashKey(kcId), hash, opts);
    await SecureStore.deleteItemAsync(attemptsKey(kcId));
  },

  verify: async (
    kcId: string,
    pin: string,
  ): Promise<{ ok: boolean; remaining: number }> => {
    const hash = await SecureStore.getItemAsync(hashKey(kcId));
    if (!hash) return { ok: false, remaining: 0 };

    const attempts = Number(
      (await SecureStore.getItemAsync(attemptsKey(kcId))) ?? "0",
    );

    if (attempts >= MAX_ATTEMPTS) return { ok: false, remaining: 0 };

    if (bcrypt.compareSync(pin, hash)) {
      await SecureStore.deleteItemAsync(attemptsKey(kcId));
      return { ok: true, remaining: MAX_ATTEMPTS };
    }

    const next = attempts + 1;
    await SecureStore.setItemAsync(attemptsKey(kcId), String(next), opts);
    return { ok: false, remaining: Math.max(0, MAX_ATTEMPTS - next) };
  },

  resetAttempts: async (kcId: string): Promise<void> => {
    await SecureStore.deleteItemAsync(attemptsKey(kcId));
  },

  clear: async (kcId: string): Promise<void> => {
    await SecureStore.deleteItemAsync(hashKey(kcId));
    await SecureStore.deleteItemAsync(attemptsKey(kcId));
  },
};
