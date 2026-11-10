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

// A beneficiary's details and payout methods; "" loads nothing
export function useBeneficiaryDetails(beneficiaryGuid: string) {
  const [data, setData] = useState<BeneficiaryPayoutsResponse | null>(null);
  const [hasError, setHasError] = useState(false);
  // Only the newest request may update the screen (avoids out-of-order results)
  const latestRequestId = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    // Nothing asked for yet (e.g. Send Money before "To" is picked)
    if (!beneficiaryGuid) return;
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

  // Only the asked-for beneficiary's details: after a switch, the previous
  // one's aren't returned while the new ones load
  const current =
    data?.beneficiary.beneficiaryGuid === beneficiaryGuid ? data : null;

  return {
    data: current,
    // Loading: a beneficiary is asked for, and its details aren't here yet
    isLoading: !!beneficiaryGuid && !current && !hasError,
    hasError,
    refresh,
  };
}
