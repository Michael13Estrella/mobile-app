/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-02
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import * as WebBrowser from "expo-web-browser";
import { Stack } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="otp" options={{ animation: "none" }} />
    </Stack>
  );
}
