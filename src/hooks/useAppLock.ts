/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-24
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useEffect, useRef } from "react";
import { useAppDispatch } from "../store";
import { setLocked } from "../store/slices/uiSlice";
import { AppState } from "react-native";
import { lockService } from "../services/security/lockService";

const LOCK_TIMEOUT_MS = 5 * 60 * 1000; // re-lock after 5 min in background

export function useAppLock() {
  const dispatch = useAppDispatch();
  const backgroundedAt = useRef<number | null>(null);

  // NOTE: cold-start lock is decided in _layout's restoreSession
  // (before the splash hides), so the overlay is present on the first frame - no home flash here

  // Background timeout
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (state) => {
      if (state === "background" || state === "inactive") {
        backgroundedAt.current = Date.now();
      } else if (state === "active" && backgroundedAt.current) {
        const elapsed = Date.now() - backgroundedAt.current;
        backgroundedAt.current = null;
        if (elapsed > LOCK_TIMEOUT_MS && (await lockService.shouldLock())) {
          dispatch(setLocked(true));
        }
      }
    });
    return () => sub.remove();
  }, [dispatch]);
}
