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
import { useState } from "react";
import { SettingsSection } from "../../../src/components/features/settings/SettingsSection";
import { SettingsRow } from "../../../src/components/features/settings/SettingsRow";
import { AppSwitch } from "../../../src/components/common/AppSwitch";

// Profile & Settings: from the More tab
export default function ProfileSettingsScreen() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const profile = useAppSelector((s) => s.remitter.profile);
  // TODO: looks only for now; to be linked to biometric login
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);

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

      {/* My Profile */}
      <SettingsSection title={t("profileSettings.sections.myProfile")}>
        <SettingsRow
          icon="user01Line"
          title={t("profileSettings.rows.personalInformation")}
        />
        <SettingsRow
          icon="pin02Line"
          title={t("profileSettings.rows.contactDetails")}
        />
      </SettingsSection>

      {/* Preferences */}
      <SettingsSection title={t("profileSettings.sections.preferences")}>
        <SettingsRow
          icon="settings04Line"
          title={t("profileSettings.rows.notificationsLanguage")}
        />
      </SettingsSection>

      {/* Security */}
      <SettingsSection title={t("profileSettings.sections.security")}>
        <SettingsRow
          icon="atSignLine"
          title={t("profileSettings.rows.accountEmail")}
        />
        <SettingsRow
          icon="lock01Line"
          title={t("profileSettings.rows.password")}
          description={t("profileSettings.rows.passwordDescription")}
        />
        <SettingsRow
          icon="passcodeLine"
          title={t("profileSettings.rows.passcode")}
        />
        <SettingsRow
          icon="fingerprint03Line"
          title={t("profileSettings.rows.biometrics")}
          right={
            <AppSwitch
              value={isBiometricsEnabled}
              onValueChange={() => setIsBiometricsEnabled((value) => !value)}
              accessibilityLabel={t("profileSettings.rows.biometrics")}
            />
          }
        />
      </SettingsSection>

      {/* Help & Support */}
      <SettingsSection title={t("profileSettings.sections.helpSupport")}>
        <SettingsRow
          icon="phoneCallLine"
          title={t("profileSettings.rows.contact")}
        />
        <SettingsRow
          icon="infoCircleLine"
          title={t("profileSettings.rows.about")}
        />
      </SettingsSection>

      {/* TODO: temporary, until the design has a place for logging out */}
      <AppButton
        label={t("profileSettings.logout")}
        variant="danger"
        onPress={signOut}
      />
    </AppScreen>
  );
}
