/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-03
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
