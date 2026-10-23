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

import { useAppSelector } from "../store";
import { getRemitterDisplayName } from "../utils/remitter/remitter";

// The signed-in remitter's display name, or null until the dashboard loads
export function useRemitterDisplayName(): string | null {
  return useAppSelector((s) => {
    const profile = s.remitter.profile;
    return profile ? getRemitterDisplayName(profile) : null;
  });
}
