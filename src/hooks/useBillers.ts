/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useCallback, useEffect, useState } from "react";
import { Biller } from "../types";
import { referenceDataService } from "../services/reference/referenceDataService";

// The billers for Add Biller's picker. Loaded when the screen mounts;
// `refresh` reloads them (e.g. after a failed load)
export function useBillers() {
  const [billers, setBillers] = useState<Biller[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      setBillers(await referenceDataService.fetchBillers());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { billers, isLoading, refresh };
}
