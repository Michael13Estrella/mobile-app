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
