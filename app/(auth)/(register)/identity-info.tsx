/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-09-18
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useMemo } from "react";
import { useTranslation } from "../../../src/hooks/useTranslation";
import z from "zod";
import { HALF_WIDTH_ROMAJI_REGEX } from "../../../src/constants/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../../src/store";
import { updateRegistrationDetails } from "../../../src/store/slices/registrationSlice";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { AppHeader } from "../../../src/components/common/AppHeader";
import { router } from "expo-router";
import { RegisterStepper } from "../../../src/components/features/register/RegisterStepper";
import { AppButton } from "../../../src/components/common/AppButton";

import { RegisterSectionHeader } from "../../../src/components/features/register/RegisterSectionHeader";
import { useReferenceData } from "../../../src/hooks/useReferenceData";
import { toDropdownOptions } from "../../../src/utils/referenceData";
import { AppSelect } from "../../../src/components/form/AppSelect";
import { AppInput } from "../../../src/components/form/AppInput";
import { AppDateInput } from "../../../src/components/form/AppDateInput";
import { FORM_VALIDATION_MODE } from "../../../src/constants/form";
import { useRegisterStepNavigation } from "../../../src/hooks/useRegisterStepNavigation";
import { getErrorFieldLabels } from "../../../src/utils/formErrors";
import { FormErrorSummary } from "../../../src/components/form/FormErrorSummary";

export default function RegisterIdentityInfoScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { goToConfirm } = useRegisterStepNavigation();
  const locale = useAppSelector((s) => s.ui.locale);
  const details = useAppSelector((s) => s.registration.details);

  const { items: primaryIds } = useReferenceData("primaryId");
  const primaryIdOptions = toDropdownOptions(primaryIds, locale);

  const schema = useMemo(
    () =>
      z.object({
        primaryIDType: z.string().min(1, t("validation.required")),
        primaryIDNo: z
          .string()
          .min(1, t("validation.required"))
          .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly")),
        primaryIDExpiry: z
          .string()
          .min(1, t("validation.required"))
          .refine(
            (val) =>
              new Date(val).getTime() >= Date.now() - 24 * 60 * 60 * 1000,
            { message: t("validation.expiryMustBeFuture") },
          ),
      }),
    [t],
  );

  type IdentityInfoFormValues = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<IdentityInfoFormValues>({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: {
      primaryIDType: details.primaryIDType,
      primaryIDNo: details.primaryIDNo,
      primaryIDExpiry: details.primaryIDExpiry,
    },
  });

  const errorFields = getErrorFieldLabels(errors, {
    primaryIDType: t("remitter.primaryIdType.label"),
    primaryIDNo: t("remitter.primaryIdNo.label"),
    primaryIDExpiry: t("remitter.primaryIdExpiry.label"),
  });

  const onSubmit = (data: {
    primaryIDType: string;
    primaryIDNo: string;
    primaryIDExpiry: string;
  }) => {
    dispatch(
      updateRegistrationDetails({
        primaryIDType: data.primaryIDType,
        primaryIDNo: data.primaryIDNo,
        primaryIDExpiry: data.primaryIDExpiry,
      }),
    );
    goToConfirm();
  };

  return (
    <AppScreen
      gradient
      header={
        <>
          <AppHeader title={t("common.signUp")} onBack={() => router.back()} />
          <RegisterStepper currentStep={3} />
        </>
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
      {/* Section Header */}
      <RegisterSectionHeader
        title={t("identityInfo.title")}
        subtitle={t("identityInfo.subtitle")}
      />

      {/* Primary ID type */}
      <AppSelect
        control={control}
        name="primaryIDType"
        label={t("remitter.primaryIdType.label")}
        labelHelper={t("remitter.primaryIdType.labelHelper")}
        placeholder={t("remitter.primaryIdType.placeholder")}
        options={primaryIdOptions}
        required
        sortAscending
      />

      {/* Primary ID number */}
      <AppInput
        control={control}
        name="primaryIDNo"
        label={t("remitter.primaryIdNo.label")}
        placeholder={t("remitter.primaryIdNo.placeholder")}
        required
      />

      {/* Primary ID expiry */}
      <AppDateInput
        control={control}
        name="primaryIDExpiry"
        label={t("remitter.primaryIdExpiry.label")}
        leadingIcon="calendarLine"
        required
      />
    </AppScreen>
  );
}
