import { Stack } from "expo-router";

export default function RegisterLayout() {
  // Steps must be completed in order — no swipe-back between them.
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
  );
}
