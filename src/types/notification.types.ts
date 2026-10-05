import { Platform } from "react-native";

// Sent to the backend when registering this device for push.
export interface RegisterPushRequest {
  expoPushToken: string;
  platform: typeof Platform.OS; // "ios" | "android"
}

// The `data` payload carried by every notification (no sensitive values).
export type NotificationType =
  | "transfer_received"
  | "transfer_sent"
  | "security_alert";

export interface NotificationData {
  type: NotificationType;
  // an opaque id to look up details *after* the user authenticates
  referenceId?: string;
}
