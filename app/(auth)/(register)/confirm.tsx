/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-08-28
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useEffect, useState } from "react";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "../../../src/store";
import { useReferenceData } from "../../../src/hooks/useReferenceData";
import { useRegistration } from "../../../src/hooks/useRegistration";
import { GENDER_OPTIONS } from "../../../src/constants/userFields";
import { Href, router } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { Typography } from "../../../src/constants/typography";
import { AppButton } from "../../../src/components/common/AppButton";
import { ReferenceDataItem } from "../../../src/types/referenceData.types";
import { useNationalities } from "../../../src/hooks/useNationalities";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { AppHeader } from "../../../src/components/common/AppHeader";
import { RegisterSectionHeader } from "../../../src/components/features/register/RegisterSectionHeader";
import { ConfirmSection } from "../../../src/components/features/register/ConfirmSection";
import { formatIsoDate } from "../../../src/utils/format/formatDate";
import { findNationalityName } from "../../../src/utils/referenceData/nationality";
import { JAPANESE_NATIONALITY_CODE } from "../../../src/constants/nationality";
import {
  REGISTER_EDIT_MODE,
  useCollapseEditHistory,
} from "../../../src/hooks/useRegisterStepNavigation";
import { PREFECTURE_OPTIONS } from "../../../src/constants/prefectures";
import { formatPhoneNumber } from "../../../src/utils/format/phone";
import { REMITTER_PHONE_COUNTRY } from "../../../src/constants/phone";
import { formatPostalCode } from "../../../src/utils/form/formatFields";
import { useAuth } from "../../../src/hooks/useAuth";
import { clearRegistrationSecrets } from "../../../src/store/slices/registrationSlice";
import { DetailRow } from "../../../src/components/common/DetailRow";
import { ROUTES } from "../../../src/constants/routes";

const PROFESSION_OTHERS_CODE = "30";
const VISA_STATUS_OTHERS_CODE = "99";

export default function RegisterConfirmScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const locale = useAppSelector((s) => s.ui.locale);
  const { details } = useAppSelector((s) => s.registration);

  const { submitRegister } = useRegistration();
  const { finalizeSession } = useAuth();
  const dispatch = useAppDispatch();

  useCollapseEditHistory();

  const { nationalities } = useNationalities();
  const { items: visaStatuses } = useReferenceData("visaStatus");
  const { items: professions } = useReferenceData("profession");
  const { items: primaryIds } = useReferenceData("primaryId");
  const { items: advertisingSources } = useReferenceData("advertising");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Display name for a saved reference code; falls back to the code.
  const labelFor = (items: ReferenceDataItem[], code: string): string => {
    const found = items.find((i) => i.code === code);
    if (!found) return code;
    return locale === "ja" ? found.codeDescJap : found.codeDescEng;
  };

  const genderLabelKey = GENDER_OPTIONS.find(
    (option) => option.value === details.gender,
  )?.labelKey;

  const visaStatus =
    details.visaStatusCode === VISA_STATUS_OTHERS_CODE
      ? details.visaStatusOthers
      : labelFor(visaStatuses, details.visaStatusCode);

  const profession =
    details.professionCode === PROFESSION_OTHERS_CODE
      ? details.professionOthers
      : labelFor(professions, details.professionCode);

  // Prefecture are stored as e.g. "AOMORI KEN" but listed as "AOMORI".
  // Values from the postal lookup may not be in the list: show them as-is
  const prefectureLabel =
    PREFECTURE_OPTIONS.find((option) => option.value === details.prefecture)
      ?.label ?? details.prefecture;

  const phoneNumber = details.mobile
    ? formatPhoneNumber(REMITTER_PHONE_COUNTRY, details.mobile)
    : "";

  const editStep = (pathname: Href) =>
    router.push({ pathname, params: { mode: REGISTER_EDIT_MODE } } as Href);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await submitRegister();
      if (!result.ok || !result.tokens) {
        setError(result.message ?? t("errors.generic"));
        return;
      }

      // Signs the new user in and enroll the device. The root layout then
      // moves them into onboarding (secure prompt -> passcode -> biometrics).
      await finalizeSession(result.tokens);
      dispatch(clearRegistrationSecrets());
    } catch {
      setError(t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (__DEV__) console.log("details:", details);
  }, []);

  return (
    <AppScreen
      gradient
      header={
        <AppHeader
          title={t("registerConfirm.headerTitle")}
          onBack={() => router.back()}
        />
      }
      footer={
        <AppButton
          label={t("registerConfirm.submit")}
          variant="gradient"
          loading={submitting}
          disabled={submitting}
          onPress={handleSubmit}
        />
      }
    >
      <RegisterSectionHeader
        title={t("registerConfirm.title")}
        subtitle={t("registerConfirm.subtitle")}
      />

      {/* Basic information */}
      <ConfirmSection
        title={t("registerConfirm.sections.basic")}
        onEdit={() => editStep(ROUTES.REGISTER_BASIC_INFO)}
      >
        <DetailRow
          label={t("remitter.lastName.label")}
          value={details.lastName}
        />
        <DetailRow
          label={t("remitter.firstName.label")}
          value={details.firstName}
        />
        <DetailRow
          label={t("remitter.middleName.label")}
          value={details.middleName}
        />
        <DetailRow
          label={t("remitter.nationality.label")}
          value={findNationalityName(
            nationalities,
            details.nationality,
            locale,
          )}
        />
        <DetailRow
          label={t("remitter.nickname.label")}
          value={details.nickName}
        />
        <DetailRow
          label={t("remitter.gender.label")}
          value={genderLabelKey ? t(genderLabelKey) : ""}
        />
        <DetailRow
          label={t("remitter.dateOfBirth.label")}
          value={formatIsoDate(details.birthDate, locale)}
        />
        <DetailRow
          label={t("remitter.advertisingSource.label")}
          value={labelFor(advertisingSources, details.advertisingCode)}
        />
      </ConfirmSection>

      {/* Employment information */}
      <ConfirmSection
        title={t("registerConfirm.sections.employment")}
        onEdit={() => editStep(ROUTES.REGISTER_EMPLOYMENT_INFO)}
      >
        {details.nationality !== JAPANESE_NATIONALITY_CODE && (
          <DetailRow
            label={t("remitter.visaStatus.label")}
            value={visaStatus}
          />
        )}

        <DetailRow label={t("remitter.profession.label")} value={profession} />
        {/* Only the fields relevant to the chosen occupation are filled in. */}
        {!!details.companyName && (
          <DetailRow
            label={t("remitter.companyName.label")}
            value={details.companyName}
          />
        )}
        {!!details.schoolName && (
          <DetailRow
            label={t("remitter.schoolName.label")}
            value={details.schoolName}
          />
        )}
        {!!details.natureOfBusiness && (
          <DetailRow
            label={t("remitter.natureOfBusiness.label")}
            value={details.natureOfBusiness}
          />
        )}
      </ConfirmSection>

      {/* Contact information */}
      <ConfirmSection
        title={t("registerConfirm.sections.contact")}
        onEdit={() => editStep(ROUTES.REGISTER_CONTACT_INFO)}
      >
        <DetailRow label={t("remitter.mobile.label")} value={phoneNumber} />
        <DetailRow
          label={t("remitter.postalCode.label")}
          value={formatPostalCode(details.postalCode)}
        />
        <DetailRow
          label={t("remitter.prefecture.label")}
          value={prefectureLabel}
        />
        <DetailRow
          label={t("remitter.city.label")}
          value={details.addressLine1}
        />
        <DetailRow
          label={t("remitter.address.label")}
          value={details.addressLine2}
        />
        <DetailRow
          label={t("remitter.streetNumber.label")}
          value={details.addressLine3}
        />
      </ConfirmSection>

      {/* Identity information */}
      <ConfirmSection
        title={t("registerConfirm.sections.identity")}
        onEdit={() => editStep(ROUTES.REGISTER_IDENTITY_INFO)}
      >
        <DetailRow
          label={t("registerConfirm.idType")}
          value={labelFor(primaryIds, details.primaryIDType)}
        />
        <DetailRow
          label={t("remitter.primaryIdNo.label")}
          value={details.primaryIDNo}
        />
        <DetailRow
          label={t("remitter.primaryIdExpiry.label")}
          value={formatIsoDate(details.primaryIDExpiry, locale)}
        />
      </ConfirmSection>

      {!!error && <Text style={{ color: colors.error }}>{error}</Text>}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, gap: 4 },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
  },
  subtitle: { fontSize: Typography.sizes.md, marginBottom: 8 },
  sectionHeader: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    marginTop: 16,
    marginBottom: 4,
  },
  actions: { marginTop: 24, gap: 8 },
});
