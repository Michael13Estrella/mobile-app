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

import { Stack } from "expo-router";

// The Profile & Settings screens: full screen over the tabs, each with its
// own header
export default function SettingsLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
