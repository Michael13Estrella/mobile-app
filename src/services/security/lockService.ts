/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-26
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { keycloakService } from "../auth/keycloakService";
import { passcodeService } from "./passcodeService";

export const lockService = {
  shouldLock: async (): Promise<boolean> => {
    const hasSession = (await keycloakService.getRefreshToken()) !== null;
    if (!hasSession) return false;

    const currentUserId = await keycloakService.getCurrentKcId();
    return !!currentUserId && (await passcodeService.isSet(currentUserId));
  },
};
