/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Stack } from "expo-router";

// The Send Money screens (form, confirm, submitted): full screen over the
// tabs, each with its own header.
export default function SendMoneyLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
