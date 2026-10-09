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
import { View, StyleSheet, TextInput } from "react-native";
import { Button, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useTranslation } from "../../hooks/useTranslation";
import { useAppDispatch } from "../../store";
import { useAuth } from "../../hooks/useAuth";
import { setLocked } from "../../store/slices/uiSlice";
import { Typography } from "../../constants/typography";
import { biometricService } from "../../services/security/biometricService";
import { keycloakService } from "../../services/auth/keycloakService";
import { passcodeService } from "../../services/security/passcodeService";
import { setTokens, setUser } from "../../store/slices/authSlice";
import { decodeToken } from "../../utils/tokenUtils";
import { SECURITY } from "../../constants/security";

const PIN_LENGTH = SECURITY.PASSCODE.LENGTH;

export function LockScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { biometricLogin, signOut } = useAuth();

  const [bioAvailable, setBioAvailable] = useState(false);
  const [isPinSet, setIsPinSet] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const dismissedRef = useRef(false);

  const fallbackToOidc = useCallback(async () => {
    dismissedRef.current = true; // stop any pending auto-prompt
    await signOut(); // clears tokens -> OIDC required
    dispatch(setLocked(false));
  }, [signOut, dispatch]);

  const unlockBiometric = useCallback(async () => {
    if (busy || dismissedRef.current) return;
    setBusy(true);
    try {
      const result = await biometricLogin();
      if (result === "success") {
        dispatch(setLocked(false));
      } else if (result === "invalidated") {
        await fallbackToOidc();
      }
      // cancelled / fallback -> stay locked; user can use PASSCODE or "another way"
    } finally {
      setBusy(false);
    }
  }, [busy, biometricLogin, dispatch, fallbackToOidc]);

  const submitPasscode = useCallback(
    async (value: string) => {
      if (!currentUserId) return fallbackToOidc();

      setBusy(true);
      setError(null);

      try {
        const { ok, remaining } = await passcodeService.verify(
          currentUserId,
          value,
        );

        if (ok) {
          // PASSCODE proves presence; tokens come from a DBRS refresh.
          const tokens = await keycloakService.refreshAccessToken(true);
          if (tokens) {
            dispatch(setTokens(tokens));
            const decoded = decodeToken(tokens.accessToken);
            if (decoded) dispatch(setUser(decoded));
            dispatch(setLocked(false));
          } else {
            await fallbackToOidc(); // refresh failed -> OIDC
          }
        } else if (remaining === 0) {
          await fallbackToOidc(); // locked out -> OIDC
        } else {
          setError(t("lock.pinWrong", { remaining }));
          setPasscode("");
        }
      } finally {
        setBusy(false);
      }
    },
    [currentUserId, dispatch, fallbackToOidc, t],
  );

  // On mount: detect methods AND auto-prompt biometrics if available.
  useEffect(() => {
    (async () => {
      const bioUserId = await biometricService.getActiveUser();
      const canBio =
        !!bioUserId && (await biometricService.canUseBiometricLogin(bioUserId));
      setBioAvailable(canBio);

      const userId = await keycloakService.getCurrentKcId();
      setCurrentUserId(userId);
      setIsPinSet(!!userId && (await passcodeService.isSet(userId)));

      if (canBio && !dismissedRef.current) unlockBiometric(); // prompt biometrics by default
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <MaterialCommunityIcons
        name="lock-outline"
        size={56}
        color={colors.iconPrimary}
      />
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t("lock.title")}
      </Text>

      {isPinSet && (
        <>
          <TextInput
            style={[
              styles.passcode,
              { color: colors.textPrimary, borderColor: colors.secondary },
            ]}
            value={passcode}
            onChangeText={(v) => {
              const digits = v.replace(/\D/g, "").slice(0, PIN_LENGTH);
              setPasscode(digits);
              if (digits.length === PIN_LENGTH) void submitPasscode(digits);
            }}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={PIN_LENGTH}
            autoFocus={!bioAvailable}
            editable={!busy}
            placeholder={t("lock.enterPin")}
            placeholderTextColor={colors.textSecondary}
          />
          {!!error && <Text style={{ color: colors.error }}>{error}</Text>}
        </>
      )}

      {bioAvailable && (
        <Button
          onPress={unlockBiometric}
          loading={busy}
          disabled={busy}
          icon="fingerprint"
        >
          {t("lock.useBiometric")}
        </Button>
      )}

      <Button onPress={fallbackToOidc}>{t("lock.useAnotherWay")}</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
    zIndex: 100,
  },
  title: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  passcode: {
    borderWidth: 1.5,
    borderRadius: 10,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: "center",
    width: 200,
    paddingVertical: 12,
  },
  text: {
    color: "#059ED8",
  },
});
