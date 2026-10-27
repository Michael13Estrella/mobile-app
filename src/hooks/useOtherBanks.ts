/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-27
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useEffect, useState } from "react";
import { OtherBank } from "../types";
import { referenceDataService } from "../services/reference/referenceDataService";

/**
 * The banks an "Other bank" payout can go to.
 *
 * @returns The banks, loaded once ([] while loading, or when they couldn't be loaded)
 * @example const { banks } = useOtherBanks();
 */
export function useOtherBanks() {
  const [otherBanks, setOtherBanks] = useState<OtherBank[]>([]);

  useEffect(() => {
    let isCancelled = false;
    void referenceDataService.fetchOtherBanks().then((result) => {
      if (!isCancelled) setOtherBanks(result);
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  return { otherBanks };
}
