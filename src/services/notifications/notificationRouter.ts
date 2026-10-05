import { NotificationData } from "../../types";

export interface NotificationRoute {
  pathname: string;
  params?: Record<string, string>;
}

// Single source of truth for notification target routes
// Adjust these paths to match actual expo-router screens
const ROUTES = {
  transactionDetail: "/(protected)/(tabs)/transactions/[id]",
  transactions: "/(protected)/(tabs)/transactions",
  security: "/(protected)/settings/security",
} as const;

export const resolveNotificationRoute = (
  data: NotificationData | undefined,
): NotificationRoute | null => {
  switch (data?.type) {
    case "transfer_received":
    case "transfer_sent":
      return data.referenceId
        ? {
            pathname: ROUTES.transactionDetail,
            params: { id: data.referenceId },
          }
        : { pathname: ROUTES.transactions };
    case "security_alert":
      return { pathname: ROUTES.security };
    default:
      return null; // unknown/missing -> caller decides (e.g. fall back to home)
  }
};
