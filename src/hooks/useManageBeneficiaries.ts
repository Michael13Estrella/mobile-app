/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-19
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useCallback, useRef, useState } from "react";
import { ManageBeneficiariesResponse } from "../types";
import { beneficiaryService } from "../services/beneficiary/beneficiaryService";
import { useFocusEffect } from "expo-router";

export function useManageBeneficiaries() {
  const [data, setData] = useState<ManageBeneficiariesResponse | null>(null);
  const [hasError, setHasError] = useState(false);
  const latestRequestId = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    const result = await beneficiaryService.fetchBeneficiaries();
    if (requestId !== latestRequestId.current) return;

    if (!result) {
      // Keep the last good lists; the screen shows the error
      setHasError(true);
      return;
    }

    setData(result);
    setHasError(false);
  }, []);

  // Reload each time the screen is shown, not only on mount (tab screens
  // stay mounted). useCallback is required, or it would re-run every render.
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return {
    data,
    isLoading: !data && !hasError,
    hasError,
    refresh,
  };
}
