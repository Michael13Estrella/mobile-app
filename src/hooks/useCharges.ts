/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-14
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useCallback, useEffect, useState } from "react";
import { ChargeTier } from "../types";
import { chargeService } from "../services/remittance/chargeService";

// Service charge tiers for the remittance simulator. Loaded when the screen
// mounts; `refresh` reloads them (e.g. pull-to-refresh)
export function useCharges() {
  const [charges, setCharges] = useState<ChargeTier[]>([]);

  const refresh = useCallback(async () => {
    setCharges(await chargeService.fetchCharges());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { charges, refresh };
}
