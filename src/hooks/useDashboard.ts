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

import { useCallback, useRef, useState } from "react";
import { userStorageService } from "../services/storage/userStorageService";
import { useAppDispatch, useAppSelector } from "../store";
import { DashboardStatsResponse, Remitter } from "../types";
import { getRemitterDisplayName } from "../utils/remitter";
import { remitterService } from "../services/remitter/remitterService";
import { setRemitter } from "../store/slices/remitterSlice";
import { useFocusEffect } from "expo-router";

// Everything Home shows except the remitter (that one goes to Redux).
export type DashboardData = Omit<DashboardStatsResponse, "remitter">;

// Keeps the lock screen's greeting name current; writes only on a change.
const saveDisplayName = async (kcId: string, remitter: Remitter) => {
  const displayName = getRemitterDisplayName(remitter);
  if ((await userStorageService.getDisplayName(kcId)) !== displayName) {
    await userStorageService.setDisplayName(kcId, displayName);
  }
};

// Loads the dashboard whenever Home gains focus (e.g. back from Send Money,
// so new transactions show), plus pull-to-refresh / retry via `refresh`
export function useDashboard() {
  const dispatch = useAppDispatch();
  const kcId = useAppSelector((s) => s.auth.user?.id);
  const [data, setData] = useState<DashboardData | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Only the newest request may update the screen (avoids out-of-order results).
  const latestRequestId = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    const result = await remitterService.fetchDashboardStats();
    if (requestId !== latestRequestId.current) return;

    if (!result) {
      // Keep showing the last good data; the screen decides how to show
      // the error (full error state only when there's nothing yet)
      setHasError(true);
      return;
    }

    const { remitter, ...dashboard } = result;
    dispatch(setRemitter(remitter));
    setData(dashboard);
    setHasError(false);

    // Not critical: a failed write only means a generic lock greeting.
    if (kcId) saveDisplayName(kcId, remitter).catch(() => undefined);
  }, [dispatch, kcId]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await load();
    } finally {
      setIsRefreshing(false);
    }
  }, [load]);

  // Reload each time Home is shown, not only on mount: tab screens stay
  // mounted, so useEffect would not run again after switching tabs.
  // useCallback is required, or it would re-run on every render
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return {
    data,
    // First load: nothing to show yet and no error
    isLoading: !data && !hasError,
    isRefreshing,
    hasError,
    refresh,
  };
}
