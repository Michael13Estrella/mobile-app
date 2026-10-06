import { router } from "expo-router";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "../../../src/store";
import { clearRegistration } from "../../../src/store/slices/registrationSlice";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { AppButton } from "../../../src/components/common/AppButton";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../../src/constants/spacing";
import { AppText } from "../../../src/components/common/AppText";
import { AppCard } from "../../../src/components/common/AppCard";
import { ConfirmRow } from "../../../src/components/features/register/ConfirmRow";
import { formatIsoDate } from "../../../src/utils/formatDate";
import { useReferenceData } from "../../../src/hooks/useReferenceData";
import { getReferenceLabel } from "../../../src/utils/referenceData";
import { StatusIcon } from "../../../src/components/common/StatusIcon";
import { AppHeader } from "../../../src/components/common/AppHeader";
import { AppDivider } from "../../../src/components/common/AppDivider";

export default function RegisterSubmittedScreen() {
  const { colors } = useAppTheme();
  const { t, locale } = useTranslation();
  const dispatch = useAppDispatch();
  const { email, details } = useAppSelector((s) => s.registration);
  const { items: primaryIds } = useReferenceData("primaryId");
  const { items: advertisingSources } = useReferenceData("advertising");

  // The registration stores the ID type's code; show its name.
  const idTypeName = getReferenceLabel(
    primaryIds,
    details.primaryIDType,
    locale,
  );

  // "How did you find our service?" is stored as a code; show its name
  const referralName = getReferenceLabel(
    advertisingSources,
    details.advertisingCode,
    locale,
  );

  const handleExplore = () => {
    dispatch(clearRegistration()); // last of the sign-up data leaves memory
    router.replace("/(protected)/(tabs)/home");
  };

  return (
    <AppScreen
      gradient
      header={<AppHeader title="Registration" />}
      footer={
        <AppButton
          label={t("onboarding.submitted.button")}
          variant="gradient"
          onPress={handleExplore}
        />
      }
    >
      <View style={styles.header}>
        <StatusIcon status="pending" />

        <AppText
          typographyType="h4"
          color={colors.textPrimary}
          style={styles.centered}
        >
          {t("onboarding.submitted.title")}
        </AppText>
        <AppText
          typographyType="body2"
          color={colors.textPrimary}
          style={styles.centered}
        >
          {t("onboarding.submitted.subtitle")}
        </AppText>
      </View>

      <AppCard variant="outlined">
        <ConfirmRow label={t("login.email.label")} value={email} />
        <ConfirmRow
          label={t("remitter.dateOfBirth.label")}
          value={formatIsoDate(details.birthDate, locale)}
        />
        <ConfirmRow
          label={t("onboarding.submitted.idProvided")}
          value={idTypeName}
        />

        <AppDivider />

        <ConfirmRow
          label={t("onboarding.submitted.referral")}
          value={referralName}
        />
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    gap: Spacing.s4,
  },
  icon: {
    backgroundColor: "#CBAB05",
    height: 28,
    width: 28,
    alignItems: "center",
    borderColor: "#bbb",
    borderRadius: 100,
    borderWidth: 6,
    padding: 6,
    flex: 1,
    gap: 10,
  },

  centered: {
    textAlign: "center",
  },
  card: {
    gap: Spacing.s4,
  },
});
