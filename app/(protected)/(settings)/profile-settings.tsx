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

import { router } from "expo-router";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { Spacing } from "../../../src/constants/spacing";
import { useAuth } from "../../../src/hooks/useAuth";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { useAppSelector } from "../../../src/store";
import { AppHeader } from "../../../src/components/common/AppHeader";
import { ProfileSummary } from "../../../src/components/features/settings/ProfileSummary";
import {
  getRemitterFullName,
  getRemitterInitials,
} from "../../../src/utils/remitter/remitter";
import { AppButton } from "../../../src/components/common/AppButton";

// Profile & Settings: from the More tab
export default function ProfileSettingsScreen() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const profile = useAppSelector((s) => s.remitter.profile);

  return (
    <AppScreen
      gradient
      contentGap={Spacing.s7}
      header={
        <AppHeader
          title={t("profileSettings.title")}
          onBack={() => router.back()}
        />
      }
    >
      {/* The profile is loaded with the dashboard, before this screen */}
      {profile && (
        <ProfileSummary
          initials={getRemitterInitials(profile)}
          name={getRemitterFullName(profile)}
          // TODO: the customer ID, once the backend sends it
          customerId={"123456"}
        />
      )}

      {/* TODO: temporary, until the design has a place for logging out */}
      <AppButton
        label={t("profileSettings.logout")}
        variant="danger"
        onPress={signOut}
      />
    </AppScreen>
  );
}
