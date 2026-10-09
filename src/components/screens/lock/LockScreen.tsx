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

import { useEffect, useRef, useState } from "react";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useUnlockFlow } from "../../../hooks/useUnlockFlow";
import { BackHandler, StyleSheet, View } from "react-native";
import { PasscodeUnlockScreen } from "./PasscodeUnlockScreen";
import { LockWelcomeScreen } from "./LockWelcomeScreen";

type LockView = "welcome" | "passcode";

// Full-screen overlay shown while the app is locked (rendered by the root
// layout above every route, so it isn't part of navigation).
export function LockScreen() {
  const { colors } = useAppTheme();
  const {
    isReady,
    method,
    biometryType,
    displayName,
    busy,
    passcodeError,
    unlockWithBiometrics,
    unlockWithPasscode,
    loginWithPassword,
  } = useUnlockFlow();

  const [view, setView] = useState<LockView>("welcome");

  // Too many failed biometric tries: the flow switches to the passcode,
  // so open the passcode view right away
  const previousMethod = useRef(method);
  useEffect(() => {
    if (previousMethod.current === "biometric" && method === "passcode") {
      setView("passcode");
    }
    previousMethod.current = method;
  }, [method]);

  // Android back: the screens underneath must not navigate while locked.
  // From the passcode view it returns to the welcome view.
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setView("welcome");
        return true;
      },
    );
    return () => subscription.remove();
  }, []);

  const handleLoginWithPassword = () => void loginWithPassword();

  const renderView = () => {
    // Wait for the biometrics check so the wrong button never flashes.
    if (!isReady) return null;

    if (view === "passcode") {
      return (
        <PasscodeUnlockScreen
          busy={busy}
          error={passcodeError}
          onSubmit={(passcode) => void unlockWithPasscode(passcode)}
          onLoginWithPassword={handleLoginWithPassword}
          onBack={() => setView("welcome")}
        />
      );
    }

    return (
      <LockWelcomeScreen
        method={method}
        biometryType={biometryType}
        displayName={displayName}
        busy={busy}
        onBiometricLogin={() => void unlockWithBiometrics()}
        onPasscodeLogin={() => setView("passcode")}
        onLoginWithPassword={handleLoginWithPassword}
        onForgotPassword={() => {}}
      />
    );
  };

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.overlay,
        { backgroundColor: colors.background },
      ]}
    >
      {renderView()}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    zIndex: 100,
  },
});
