/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-06-30
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Href } from "expo-router";
import { NotificationData } from "../../types";
import { ROUTES } from "../../constants/routes";
import { BENEFICIARY_REVIEW_RESULT } from "../../constants/beneficiary";

// The review result each beneficiary notification opens
const REVIEW_RESULTS = {
  beneficiary_approved: BENEFICIARY_REVIEW_RESULT.APPROVED,
  beneficiary_denied: BENEFICIARY_REVIEW_RESULT.DENIED,
} as const;

export type NotificationRoute = Href;

export const resolveNotificationRoute = (
  data: NotificationData | undefined,
): NotificationRoute | null => {
  switch (data?.type) {
    case "beneficiary_approved":
    case "beneficiary_denied":
      return data.referenceId
        ? ROUTES.BENEFICIARY_REVIEW_RESULTS(
            data.referenceId,
            REVIEW_RESULTS[data.type],
          )
        : ROUTES.MANAGE_BENEFICIARIES;
    case "transfer_received":
    case "transfer_sent":
    case "security_alert":
      return ROUTES.HOME;
    default:
      return null; // unknown/missing -> caller decides (e.g. fall back to home)
  }
};
