/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-07
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useCallback, useEffect, useRef, useState } from "react";
import { SECURITY } from "../constants/security";
import { useAppDispatch } from "../store";
import { useAuth } from "./useAuth";
import { useTranslation } from "./useTranslation";
import { setLocked } from "../store/slices/uiSlice";
import { passcodeService } from "../services/security/passcodeService";
import { keycloakService } from "../services/auth/keycloakService";
import { setTokens, setUser } from "../store/slices/authSlice";
import { decodeToken } from "../utils/tokenUtils";
import { biometricService } from "../services/security/biometricService";
import { BiometryType } from "react-native-biometrics";
import { userStorageService } from "../services/storage/userStorageService";

const MAX_BIOMETRIC_ATTEMPTS = SECURITY.BIOMETRIC.MAX_ATTEMPTS;

// Quick unlock offered on the lock screen. Every user has a passcode, so
// it's always available; biometrics code first when enabled.
export type QuickUnlockMethod = "biometric" | "passcode";

// Lock-screen unlocking: biometrics -> passcode -> full login (OIDC).
export function useUnlockFlow() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { biometricLogin, signOut } = useAuth();

  const [isReady, setIsReady] = useState(false);
  const [method, setMethod] = useState<QuickUnlockMethod>("passcode");
  const [biometryType, setBiometryType] = useState<BiometryType | null>(null);
  // Saved by the dashboard; null on a new device / before the first load
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  const biometricFailures = useRef(0);
  // Set once the user leaves for the full login, so no prompt pops up after
  const hasLeftRef = useRef(false);

  const unlock = useCallback(() => dispatch(setLocked(false)), [dispatch]);

  // Full login (password / OIDC): clears the session so OIDC is required.
  const loginWithPassword = useCallback(async () => {
    hasLeftRef.current = true;
    await signOut();
    dispatch(setLocked(false));
  }, [signOut, dispatch]);

  const unlockWithBiometrics = useCallback(async () => {
    if (busy || hasLeftRef.current) return;
    setBusy(true);

    try {
      const result = await biometricLogin();

      if (result === "success") {
        unlock();
        return;
      }
      if (result === "invalidated") {
        // Biometric changed on the device: don't trust any quick unlock.
        await loginWithPassword();
        return;
      }
      if (result === "fallback") {
        // Failed / locked out (cancel doesn't count: the user chose to stop).
        biometricFailures.current += 1;
        if (biometricFailures.current >= MAX_BIOMETRIC_ATTEMPTS) {
          setMethod("passcode");
        }
      }
    } finally {
      setBusy(false);
    }
  }, [busy, biometricLogin, unlock, loginWithPassword]);

  const unlockWithPasscode = useCallback(
    async (passcode: string) => {
      if (!userId) {
        await loginWithPassword();
        return;
      }

      setBusy(true);
      setPasscodeError(null);

      try {
        // No stored passcode (e.g. app data partly wiped) -> remaining 0
        // which leads to the full login below instead of a dead end.
        const { ok, remaining } = await passcodeService.verify(
          userId,
          passcode,
        );

        if (ok) {
          // The passcode proves presence; tokens come from a (DBRS) refresh.
          const tokens = await keycloakService.refreshAccessToken(true);
          if (!tokens) {
            await loginWithPassword(); // refresh failed -> full login
            return;
          }
          dispatch(setTokens(tokens));
          const decoded = decodeToken(tokens.accessToken);
          if (decoded) dispatch(setUser(decoded));
          unlock();
        } else if (remaining === 0) {
          await loginWithPassword(); // too many wrong passcodes -> full login
        } else {
          setPasscodeError(t("lockScreen.passcodeWrong", { remaining }));
        }
      } finally {
        setBusy(false);
      }
    },
    [userId, loginWithPassword, dispatch, unlock, t],
  );

  // On mount: use biometrics if enabled (and prompt once), else the passcode.
  useEffect(() => {
    const detect = async () => {
      const bioUserId = await biometricService.getActiveUser();
      const canUseBiometrics =
        !!bioUserId && (await biometricService.canUseBiometricLogin(bioUserId));

      const currentKcId = await keycloakService.getCurrentKcId();
      setUserId(currentKcId);
      if (currentKcId) {
        setDisplayName(await userStorageService.getDisplayName(currentKcId));
      }

      if (canUseBiometrics) {
        const capability = await biometricService.isAvailable();
        setBiometryType(capability.biometryType ?? null);
        setMethod("biometric");
      }
      setIsReady(true);

      if (canUseBiometrics && !hasLeftRef.current) void unlockWithBiometrics();
    };

    void detect();
    // Runs once when the lock screen appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isReady,
    method,
    biometryType,
    displayName,
    busy,
    passcodeError,
    unlockWithBiometrics,
    unlockWithPasscode,
    loginWithPassword,
  };
}
