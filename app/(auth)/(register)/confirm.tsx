import { useState } from "react";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { useAppSelector } from "../../../src/store";
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
import { ConfirmRow } from "../../../src/components/features/register/ConfirmRow";
import { formatIsoDate } from "../../../src/utils/formatDate";
import { findNationalityName } from "../../../src/utils/nationality";
import { JAPANESE_NATIONALITY_CODE } from "../../../src/constants/nationality";
import { REGISTER_EDIT_MODE } from "../../../src/hooks/useRegisterStepNavigation";

const PROFESSION_OTHERS_CODE = "30";
const VISA_STATUS_OTHERS_CODE = "99";

export default function RegisterConfirmScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const locale = useAppSelector((s) => s.ui.locale);
  const { details } = useAppSelector((s) => s.registration);
  const { submitRegister } = useRegistration();

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

  const editStep = (pathname: Href) =>
    router.push({ pathname, params: { mode: REGISTER_EDIT_MODE } } as Href);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await submitRegister();
      if (!result.ok) {
        setError(result.message ?? t("errors.generic"));
        return;
      }

      // Registered: no way back into the registration screens.
      router.replace("/(protected)/(onboarding)/secure-prompt");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppScreen
      gradient
      header={<AppHeader title={t("registerConfirm.headerTitle")} />}
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
        onEdit={() => editStep("/(auth)/(register)/basic-info")}
      >
        <ConfirmRow
          label={t("remitter.lastName.label")}
          value={details.lastName}
        />
        <ConfirmRow
          label={t("remitter.firstName.label")}
          value={details.firstName}
        />
        <ConfirmRow
          label={t("remitter.middleName.label")}
          value={details.middleName}
        />
        <ConfirmRow
          label={t("remitter.nationality.label")}
          value={findNationalityName(
            nationalities,
            details.nationality,
            locale,
          )}
        />
        <ConfirmRow
          label={t("remitter.nickname.label")}
          value={details.nickName}
        />
        <ConfirmRow
          label={t("remitter.gender.label")}
          value={genderLabelKey ? t(genderLabelKey) : ""}
        />
        <ConfirmRow
          label={t("remitter.dateOfBirth.label")}
          value={formatIsoDate(details.birthDate, locale)}
        />
        <ConfirmRow
          label={t("remitter.advertisingSource.label")}
          value={labelFor(advertisingSources, details.advertisingCode)}
        />
      </ConfirmSection>

      {/* Employment information */}
      <ConfirmSection
        title={t("registerConfirm.sections.employment")}
        onEdit={() => editStep("/(auth)/(register)/employment-info")}
      >
        {details.nationality !== JAPANESE_NATIONALITY_CODE && (
          <ConfirmRow
            label={t("remitter.visaStatus.label")}
            value={visaStatus}
          />
        )}

        <ConfirmRow label={t("remitter.profession.label")} value={profession} />
        {/* Only the fields relevant to the chosen occupation are filled in. */}
        {!!details.companyName && (
          <ConfirmRow
            label={t("remitter.companyName.label")}
            value={details.companyName}
          />
        )}
        {!!details.schoolName && (
          <ConfirmRow
            label={t("remitter.schoolName.label")}
            value={details.schoolName}
          />
        )}
        {!!details.natureOfBusiness && (
          <ConfirmRow
            label={t("remitter.natureOfBusiness.label")}
            value={details.natureOfBusiness}
          />
        )}
      </ConfirmSection>

      {/* Identity information */}
      <ConfirmSection
        title={t("registerConfirm.sections.identity")}
        onEdit={() => editStep("/(auth)/(register)/identity-info")}
      >
        <ConfirmRow
          label={t("registerConfirm.idType")}
          value={labelFor(primaryIds, details.primaryIDType)}
        />
        <ConfirmRow
          label={t("remitter.primaryIdNo.label")}
          value={details.primaryIDNo}
        />
        <ConfirmRow
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
