/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useCallback, useRef, useState } from "react";
import { EnrolledBiller } from "../types";
import { billerService } from "../services/biller/billerService";
import { useFocusEffect } from "expo-router";

/**
 * The remitter's enrolled billers, reloaded each time the screen is shown
 * (e.g. back from Add Biller), plus pull-to-refresh via `refresh`.
 *
 * @returns The billers (null until loaded), the loading/error state and refresh
 * @example const { billers, isLoading, hasError, refresh } = useEnrolledBillers();
 */
export function useEnrolledBillers() {
  const [billers, setBillers] = useState<EnrolledBiller[] | null>(null);
  const [hasError, setHasError] = useState(false);
  // Only the newest request may update the screen (avoids out-of-order results)
  const latestRequestId = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    const result = await billerService.fetchEnrolledBillers();
    if (requestId !== latestRequestId.current) return;

    if (!result) {
      // Keep the last good list; the screen shows the error
      setHasError(true);
      return;
    }

    setBillers(result);
    setHasError(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh().catch(() => undefined);
    }, [refresh]),
  );

  return {
    billers,
    isLoading: !billers && !hasError,
    hasError,
    refresh,
  };
}
