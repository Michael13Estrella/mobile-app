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

import { useTranslation } from "../../../src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "../../../src/store";
import { useReferenceData } from "../../../src/hooks/useReferenceData";
import { toDropdownOptions } from "../../../src/utils/referenceData";
import z from "zod";
import { HALF_WIDTH_ROMAJI_REGEX } from "../../../src/constants/validation";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateRegistrationDetails } from "../../../src/store/slices/registrationSlice";
import { router } from "expo-router";
import { AppSelect } from "../../../src/components/form/AppSelect";
import { AppInput } from "../../../src/components/form/AppInput";
import { AppButton } from "../../../src/components/common/AppButton";
import { FieldLimits } from "../../../src/constants/fieldLimits";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { AppHeader } from "../../../src/components/common/AppHeader";
import { RegisterStepper } from "../../../src/components/features/register/RegisterStepper";
import { RegisterSectionHeader } from "../../../src/components/features/register/RegisterSectionHeader";
import { FieldsContainer } from "../../../src/components/form/FieldsContainer";
import { FORM_VALIDATION_MODE } from "../../../src/constants/form";
import { useRegisterStepNavigation } from "../../../src/hooks/useRegisterStepNavigation";
import { getErrorFieldLabels } from "../../../src/utils/formErrors";
import { FormErrorSummary } from "../../../src/components/form/FormErrorSummary";

const VISA_STATUS_OTHERS_CODE = "99";
const PROFESSION_OTHERS_CODE = "30";

const NATIONALITY_JAPAN_CODE = "JP";
const VISA_STATUS_JAPANESE_CODE = "98";

const COMPANY_NAME_REQUIRED_CODES = ["02", "03", "04", "06", "09", "11", "30"];
const NATURE_OF_BUSINESS_REQUIRED_CODES = ["09"];
const SCHOOL_NAME_REQUIRED_CODES = ["08"];

export default function RegisterEmploymentInfoScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { goNext } = useRegisterStepNavigation();
  const locale = useAppSelector((s) => s.ui.locale);
  const details = useAppSelector((s) => s.registration.details);

  const { items: professions } = useReferenceData("profession");
  const { items: visaStatus } = useReferenceData("visaStatus");

  const professionOptions = toDropdownOptions(professions, locale);
  const visaStatusOptions = toDropdownOptions(visaStatus, locale);

  const schema = useMemo(
    () =>
      z
        .object({
          visaStatusCode: z.string().min(1, t("validation.required")),
          visaStatusOthers: z
            .string()
            .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly"))
            .optional(),
          professionCode: z.string().min(1, t("validation.required")),
          professionOthers: z
            .string()
            .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly"))
            .optional(),
          companyName: z
            .string()
            .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly"))
            .optional(),
          schoolName: z
            .string()
            .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly"))
            .optional(),
          natureOfBusiness: z
            .string()
            .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly"))
            .optional(),
        })
        .refine(
          (d) =>
            d.visaStatusCode !== VISA_STATUS_OTHERS_CODE ||
            !!d.visaStatusOthers?.trim(),
          {
            message: t("validation.required"),
            path: ["visaStatusOthers"],
            when: () => true,
          },
        )
        .refine(
          (d) =>
            d.professionCode !== PROFESSION_OTHERS_CODE ||
            !!d.professionOthers?.trim(),
          {
            message: t("validation.required"),
            path: ["professionOthers"],
            when: () => true,
          },
        )
        .refine(
          (d) =>
            !COMPANY_NAME_REQUIRED_CODES.includes(d.professionCode) ||
            !!d.companyName?.trim(),
          {
            message: t("validation.required"),
            path: ["companyName"],
            when: () => true,
          },
        )
        .refine(
          (d) =>
            !NATURE_OF_BUSINESS_REQUIRED_CODES.includes(d.professionCode) ||
            !!d.natureOfBusiness?.trim(),
          {
            message: t("validation.required"),
            path: ["natureOfBusiness"],
            when: () => true,
          },
        )
        .refine(
          (d) =>
            !SCHOOL_NAME_REQUIRED_CODES.includes(d.professionCode) ||
            !!d.schoolName?.trim(),
          {
            message: t("validation.required"),
            path: ["schoolName"],
            when: () => true,
          },
        ),
    [t],
  );

  type EmploymentInfoFormValues = z.infer<typeof schema>;

  // Japanese nationals always have the "Japanese" visa status. For anyone
  // else that value is invalid; it can only be left over from changing the
  // nationality away from Japan, so start empty and let them choose.
  const resolveVisaStatusDefault = (): string => {
    if (details.nationality === NATIONALITY_JAPAN_CODE) {
      return VISA_STATUS_JAPANESE_CODE;
    }
    return details.visaStatusCode === VISA_STATUS_JAPANESE_CODE
      ? ""
      : details.visaStatusCode;
  };

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { isValid, errors },
  } = useForm<EmploymentInfoFormValues>({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: {
      visaStatusCode: resolveVisaStatusDefault(),
      visaStatusOthers: details.visaStatusOthers,
      professionCode: details.professionCode,
      professionOthers: details.professionOthers,
      companyName: details.companyName,
      schoolName: details.schoolName,
      natureOfBusiness: details.natureOfBusiness,
    },
  });

  const errorFields = getErrorFieldLabels(errors, {
    visaStatusCode: t("remitter.visaStatus.label"),
    // The "Others" text boxes have no label of their own: name them after
    // the selection they belong to.
    visaStatusOthers: t("remitter.visaStatus.label"),
    professionCode: t("remitter.profession.label"),
    professionOthers: t("remitter.profession.label"),
    companyName: t("remitter.companyName.label"),
    natureOfBusiness: t("remitter.natureOfBusiness.label"),
    schoolName: t("remitter.schoolName.label"),
  });

  const professionCode = useWatch({ control, name: "professionCode" });
  const visaStatusCode = useWatch({ control, name: "visaStatusCode" });

  useEffect(() => {
    const resetHiddenField = (
      name:
        | "visaStatusOthers"
        | "professionOthers"
        | "companyName"
        | "natureOfBusiness"
        | "schoolName",
    ) => {
      setValue(name, "");
      clearErrors(name);
    };
    if (visaStatusCode !== VISA_STATUS_OTHERS_CODE)
      resetHiddenField("visaStatusOthers");

    if (professionCode !== PROFESSION_OTHERS_CODE)
      resetHiddenField("professionOthers");

    if (!COMPANY_NAME_REQUIRED_CODES.includes(professionCode))
      resetHiddenField("companyName");

    if (!NATURE_OF_BUSINESS_REQUIRED_CODES.includes(professionCode))
      resetHiddenField("natureOfBusiness");

    if (!SCHOOL_NAME_REQUIRED_CODES.includes(professionCode))
      resetHiddenField("schoolName");
  }, [visaStatusCode, professionCode, setValue, clearErrors]);

  const onSubmit = (data: {
    visaStatusCode: string;
    visaStatusOthers?: string;
    professionCode: string;
    professionOthers?: string;
    companyName?: string;
    schoolName?: string;
    natureOfBusiness?: string;
  }) => {
    dispatch(
      updateRegistrationDetails({
        visaStatusCode: data.visaStatusCode,
        visaStatusOthers: data.visaStatusOthers ?? "",
        professionCode: data.professionCode,
        professionOthers: data.professionOthers ?? "",
        companyName: data.companyName ?? "",
        schoolName: data.schoolName ?? "",
        natureOfBusiness: data.natureOfBusiness ?? "",
      }),
    );
    goNext("/(auth)/(register)/contact-info");
  };

  return (
    <AppScreen
      gradient
      header={
        <>
          <AppHeader title={t("common.signUp")} onBack={() => router.back()} />
          <RegisterStepper currentStep={2} />
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
      <RegisterSectionHeader
        number={2}
        progress={66}
        title={t("employmentInfo.title")}
        subtitle={t("employmentInfo.subtitle")}
      />

      <FieldsContainer>
        {visaStatusCode !== VISA_STATUS_JAPANESE_CODE && (
          <>
            {/* Visa Status */}
            <AppSelect
              control={control}
              name="visaStatusCode"
              label={t("remitter.visaStatus.label")}
              placeholder={t("remitter.visaStatus.placeholder")}
              options={visaStatusOptions}
              required
              sortAscending
            />

            {/* Visa Status Others */}
            {visaStatusCode === VISA_STATUS_OTHERS_CODE && (
              <AppInput
                control={control}
                name="visaStatusOthers"
                placeholder={t("remitter.visaStatusOthers.placeholder")}
                required
                maxLength={FieldLimits.professionOthers}
              />
            )}
          </>
        )}

        {/* Occupation */}
        <AppSelect
          control={control}
          name="professionCode"
          label={t("remitter.profession.label")}
          placeholder={t("remitter.profession.placeholder")}
          options={professionOptions}
          required
          sortAscending
        />

        {/* Occupation Others */}
        {professionCode === PROFESSION_OTHERS_CODE && (
          <AppInput
            control={control}
            name="professionOthers"
            placeholder={t("remitter.professionOthers.placeholder")}
            required
            maxLength={FieldLimits.professionOthers}
          />
        )}

        {/* Company Name */}
        {/* 02 - COMPANY EMPLOYEE */}
        {/* 03 - COMPANY DIRECTOR */}
        {/* 04 - GOVERNMENT EMPLOYEE */}
        {/* 06 - PART-TIME/TEMPORARY/CONTRACT EMPLOYEE */}
        {/* 09 - SELF-EMPLOYED */}
        {/* 11 - TRAINEE */}
        {COMPANY_NAME_REQUIRED_CODES.includes(professionCode) && (
          <AppInput
            control={control}
            name="companyName"
            label={t("remitter.companyName.label")}
            placeholder={t("remitter.companyName.placeholder")}
            maxLength={FieldLimits.companyName}
            required
          />
        )}

        {/* Nature of Business */}
        {/* 09 - SELF-EMPLOYED */}
        {NATURE_OF_BUSINESS_REQUIRED_CODES.includes(professionCode) && (
          <AppInput
            control={control}
            name="natureOfBusiness"
            label={t("remitter.natureOfBusiness.label")}
            placeholder={t("remitter.natureOfBusiness.placeholder")}
            maxLength={FieldLimits.natureOfBusiness}
            required
          />
        )}

        {/* Student */}
        {/* 08 - STUDENT */}
        {SCHOOL_NAME_REQUIRED_CODES.includes(professionCode) && (
          <AppInput
            control={control}
            name="schoolName"
            label={t("remitter.schoolName.label")}
            placeholder={t("remitter.schoolName.placeholder")}
            maxLength={FieldLimits.schoolName}
            required
          />
        )}
      </FieldsContainer>
    </AppScreen>
  );
}
