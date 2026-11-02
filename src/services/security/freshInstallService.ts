/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-02
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { keycloakService } from "../auth/keycloakService";
import { preferenceService } from "../storage/preferenceService";
import { biometricService } from "./biometricService";

export const freshInstallService = {
  /**
   * The iOS keychain can outlive the app, but AsyncStorage doesn't. No marker
   * means a new install, so the old session and biometric key are dropped and
   * the user has to log in fully. The marker is saved last, so a failed
   * cleanup runs again on the next launch.
   */
  clearLeftoverSession: async (): Promise<void> => {
    if (await preferenceService.hasInstallMarker()) return;

    await keycloakService.clearTokens();

    const biometricUser = await biometricService.getActiveUser();
    if (biometricUser) await biometricService.handleInvalidation(biometricUser);

    await preferenceService.setInstallMarker();
  },
};
