/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-18
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { useTranslation } from "../../hooks/useTranslation";
import { ActivityIndicator } from "react-native-paper";
import { AppScreen } from "../common/AppScreen";
import { AppText } from "../common/AppText";

// Above the app screens, below the LockScreen (zIndex 100).
const OVERLAY_Z_INDEX = 10;

// "Signing in…" cover while the login finishes (shown by the root layout
// over every route, and by the OIDC callback route).
export const AuthLoadingOverlay = () => {
  const { t } = useTranslation();
  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]}>
      <AppScreen gradient contentContainerStyle={styles.content}>
        <ActivityIndicator size="large" />
        <AppText typographyType="body2">{t("common.signingIn")}</AppText>
      </AppScreen>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    zIndex: OVERLAY_Z_INDEX,
    elevation: OVERLAY_Z_INDEX, // Android draws by elevation, not zIndex
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
  },
});
