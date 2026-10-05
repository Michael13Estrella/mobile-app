import { keycloakService } from "../auth/keycloakService";
import { pinService } from "./pinService";

export const lockService = {
  shouldLock: async (): Promise<boolean> => {
    const hasSession = (await keycloakService.getRefreshToken()) !== null;
    if (!hasSession) return false;

    const currentUserId = await keycloakService.getCurrentUserId();
    return !!currentUserId && (await pinService.isSet(currentUserId));
  },
};
