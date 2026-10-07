/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-07-21
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Stack } from "expo-router";

export default function RegisterLayout() {
  // Steps must be completed in order — no swipe-back between them.
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
  );
}
