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
import { BeneficiaryPayoutsResponse } from "../types";
import { beneficiaryService } from "../services/beneficiary/beneficiaryService";
import { useFocusEffect } from "expo-router";

export function useBeneficiaryDetails(beneficiaryGuid: string) {
  const [data, setData] = useState<BeneficiaryPayoutsResponse | null>(null);
  const [hasError, setHasError] = useState(false);
  // Only the newest request may update the screen (avoids out-of-order results)
  const latestRequestId = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    const result =
      await beneficiaryService.fetchBeneficiaryPayouts(beneficiaryGuid);

    if (requestId !== latestRequestId.current) return;

    if (!result) {
      // Keep the last good details; the screen shows the error.
      setHasError(true);
      return;
    }

    setData(result);
    setHasError(false);
  }, [beneficiaryGuid]);

  // Reload each time the screen is shown (useCallback is required, or it
  // would re-run on every render)
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return {
    data,
    // First load: nothing to show yet and no error
    isLoading: !data && !hasError,
    hasError,
    refresh,
  };
}
