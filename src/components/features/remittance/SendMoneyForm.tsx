/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-09
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { router } from "expo-router";
import { useTranslation } from "../../../hooks/useTranslation";
import { AppHeader } from "../../common/AppHeader";
import { AppScreen } from "../../common/AppScreen";
import { AppButton } from "../../common/AppButton";
import { FieldsContainer } from "../../form/FieldsContainer";
import { BeneficiarySummary, RecentBeneficiary } from "../../../types";
import {
  buildSendMoneySchema,
  EMPTY_SEND_MONEY_FORM,
  SendMoneyFormValues,
} from "../../../schemas/remittance/sendMoneySchema";
import { useManageBeneficiaries } from "../../../hooks/useManageBeneficiaries";
import { useAppSelector } from "../../../store";
import { getAllBeneficiaries } from "../../../utils/beneficiary/beneficiary";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FORM_VALIDATION_MODE } from "../../../constants/form";
import { getErrorFieldLabels } from "../../../utils/form/formErrors";
import { FormErrorSummary } from "../../form/FormErrorSummary";
import { BeneficiarySelect } from "../beneficiary/BeneficiarySelect";

// Stable empty lists while loading (a new [] each render would redo the
// drawer's sorting every time)
const NO_BENEFICIARIES: readonly BeneficiarySummary[] = [];
const NO_RECENT_BENEFICIARIES: readonly RecentBeneficiary[] = [];

type SendMoneyProps = Readonly<{
  // Preselects this beneficiary (opened from a beneficiary's screen)
  initialBeneficiaryGuid?: string;
  onSubmit: (values: SendMoneyFormValues) => void;
}>;

/**
 * The Send Money form: beneficiary, payout method, source of funds, purpose
 * and amount. Only collects and validates; the screen decides what happens next.
 *
 * @example <SendMoneyForm initialBeneficiaryGuid={beneficiaryGuid} onSubmit={handleSubmit} />
 */
export function SendMoneyForm({
  initialBeneficiaryGuid,
  onSubmit,
}: SendMoneyProps) {
  const { t } = useTranslation();
  const { data: beneficiaryLists } = useManageBeneficiaries();
  // Saved by the dashboard's last load (Home)
  const recentBeneficiaries =
    useAppSelector((s) => s.dashboard.recentBeneficiaries) ??
    NO_RECENT_BENEFICIARIES;

  const beneficiaries = useMemo(
    () =>
      beneficiaryLists
        ? getAllBeneficiaries(beneficiaryLists)
        : NO_BENEFICIARIES,
    [beneficiaryLists],
  );

  const schema = useMemo(() => buildSendMoneySchema(t), [t]);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid, errors },
  } = useForm<SendMoneyFormValues>({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: {
      ...EMPTY_SEND_MONEY_FORM,
      beneficiaryGuid:
        initialBeneficiaryGuid ?? EMPTY_SEND_MONEY_FORM.beneficiaryGuid,
    },
  });

  // A preselected beneficiary that isn't saved anymore (e.g. deleted since)
  // would be a value the user can't see: start over with nothing picked
  useEffect(() => {
    if (!beneficiaryLists) return;
    const beneficiaryGuid = getValues("beneficiaryGuid");
    const isSaved = beneficiaries.some(
      (beneficiary) => beneficiary.beneficiaryGuid === beneficiaryGuid,
    );
    if (!beneficiaryGuid || !isSaved) return;
    setValue("beneficiaryGuid", EMPTY_SEND_MONEY_FORM.beneficiaryGuid);
  }, [beneficiaryLists, beneficiaries, getValues, setValue]);

  const errorFields = getErrorFieldLabels(errors, {
    beneficiaryGuid: t("sendMoney.beneficiary.label"),
  });

  return (
    <AppScreen
      gradient
      header={
        <AppHeader title={t("sendMoney.title")} onBack={() => router.back()} />
      }
      footer={
        <>
          <FormErrorSummary fields={errorFields} />

          <AppButton
            label={t("common.next")}
            variant="gradient"
            disabled={!isValid}
            onPress={handleSubmit(onSubmit)}
          />
        </>
      }
    >
      <FieldsContainer>
        {/* To: the beneficiary picker (most recent, then everyone else) */}
        <BeneficiarySelect
          control={control}
          name="beneficiaryGuid"
          label={t("sendMoney.beneficiary.label")}
          placeholder={t("sendMoney.beneficiary.placeholder")}
          beneficiaries={beneficiaries}
          recentBeneficiaries={recentBeneficiaries}
        />
      </FieldsContainer>
    </AppScreen>
  );
}
