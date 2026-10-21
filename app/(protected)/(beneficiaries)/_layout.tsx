/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-21
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Stack } from "expo-router";

// The beneficiary screens (list, details, add, edit): full screen over the
// tabs, each with its own header. Future-wide options go here.
export default function BeneficiariesLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
