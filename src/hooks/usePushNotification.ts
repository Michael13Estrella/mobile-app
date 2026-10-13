/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-30
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { useAppSelector } from "../store";
import { NotificationData } from "../types";
import {
  NotificationRoute,
  resolveNotificationRoute,
} from "../services/notifications/notificationRouter";
import { router } from "expo-router";
import { notificationService } from "../services/notifications/notificationService";

export function usePushNotification() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const isLocked = useAppSelector((s) => s.ui.isLocked);

  // Modern replacement for getLastNotificationResponseAsync + the response listener.
  // Reflects the cold-start tap AND updates on warm taps.
  const lastResponse = Notifications.useLastNotificationResponse();

  const isLockedRef = useRef(isLocked);
  const pendingRoute = useRef<NotificationRoute | null>(null);
  const handledId = useRef<string | null>(null);

  // Keep a ref so the once-registered listener reads the latest lock state.
  useEffect(() => {
    isLockedRef.current = isLocked;
  }, [isLocked]);

  // 1) Register + sync the Expo token while authenticated.
  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    const register = async () => {
      const token = await notificationService.registerForPushToken();
      if (!cancelled && token) await notificationService.syncToken(token);
    };
    void register();

    // Fires with the NATIVE device token (APNs/FCM), not the Expo token -
    // also every time register() fetches the Expo token. Only a real change
    // of the device token (rotation) needs a new Expo token; reacting to
    // every event would loop (register -> event -> register ...).
    let deviceToken: string | null = null;
    const tokenSub = Notifications.addPushTokenListener(({ data }) => {
      const rotated = deviceToken !== null && deviceToken !== data;
      deviceToken = data;
      if (rotated) register().catch(() => {});
    });

    return () => {
      cancelled = true;
      tokenSub.remove();
    };
  }, [isAuthenticated]);

  // 2) Route a tap (cold-start + warm) — once per response, only when authenticated, lock-gated.
  useEffect(() => {
    if (!isAuthenticated || !lastResponse) return;

    const id = lastResponse.notification.request.identifier;
    if (handledId.current === id) return; // already routed this response
    handledId.current = id;

    const data = lastResponse.notification.request.content.data as
      | NotificationData
      | undefined;
    const route = resolveNotificationRoute(data);
    if (!route) return;

    if (isLockedRef.current) {
      pendingRoute.current = route; // defer until unlock (effect 3)
    } else {
      router.push(route);
    }
  }, [isAuthenticated, lastResponse]);

  // 3) Flush a deferred route once the lock clears.
  useEffect(() => {
    if (!isLocked && pendingRoute.current) {
      const route = pendingRoute.current;
      pendingRoute.current = null;
      router.push(route);
    }
  }, [isLocked]);
}
