import { useEffect, useMemo } from "react";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "../../../src/store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { updateRegistrationDetails } from "../../../src/store/slices/registrationSlice";
import { AppInput } from "../../../src/components/form/AppInput";
import { AppButton } from "../../../src/components/common/AppButton";
import { useReferenceData } from "../../../src/hooks/useReferenceData";
import { toDropdownOptions } from "../../../src/utils/referenceData";
import { AppSelect } from "../../../src/components/form/AppSelect";
import { HALF_WIDTH_ROMAJI_REGEX } from "../../../src/constants/validation";
import { AppGenderSelect } from "../../../src/components/form/AppGenderSelect";
import { FieldLimits } from "../../../src/constants/fieldLimits";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { AppHeader } from "../../../src/components/common/AppHeader";
import { RegisterSectionHeader } from "../../../src/components/features/register/RegisterSectionHeader";
import { AppDateInput } from "../../../src/components/form/AppDateInput";
import {
  calculateAge,
  isFutureDate,
  isValidCalendarDate,
} from "../../../src/utils/dateValidation";
import { RegisterStepper } from "../../../src/components/features/register/RegisterStepper";
import { FieldsContainer } from "../../../src/components/form/FieldsContainer";
import { FORM_VALIDATION_MODE } from "../../../src/constants/form";
import { useNationalities } from "../../../src/hooks/useNationalities";
import { toNationalityOptions } from "../../../src/utils/nationality";
import {
  isNickNameRequired,
  PINNED_NATIONALITY_CODES,
} from "../../../src/constants/nationality";
import { useRegisterStepNavigation } from "../../../src/hooks/useRegisterStepNavigation";
import { FormErrorSummary } from "../../../src/components/form/FormErrorSummary";
import { getErrorFieldLabels } from "../../../src/utils/formErrors";

const MIN_AGE_YEAR = 18;

export default function RegisterBasicInfoScreen() {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const locale = useAppSelector((s) => s.ui.locale);
  const details = useAppSelector((s) => s.registration.details);
  const { goNext } = useRegisterStepNavigation();

  const { nationalities } = useNationalities();
  const { items: advertising } = useReferenceData("advertising");
  const nationalityOptions = toNationalityOptions(nationalities, locale);
  const advertisingOptions = toDropdownOptions(advertising, locale);

  const schema = useMemo(
    () =>
      z
        .object({
          firstName: z
            .string()
            .min(1, t("validation.required"))
            .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly")),
          middleName: z
            .string()
            .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly"))
            .optional(),
          lastName: z
            .string()
            .min(1, t("validation.required"))
            .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly")),
          nickname: z
            .string()
            .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly"))
            .optional(),
          gender: z.enum(["M", "F"]).or(z.literal("")),
          nationality: z.string().min(1, t("validation.required")),
          birthDate: z
            .string()
            .min(1, t("validation.required"))
            .refine(isValidCalendarDate, t("validation.invalidDate"))
            .refine((iso) => !isFutureDate(iso), t("validation.invalidDate"))
            .refine(
              (iso) => calculateAge(iso) >= MIN_AGE_YEAR,
              t("validation.minimumAge", { min: MIN_AGE_YEAR }),
            ),
          advertisingCode: z.string().min(1, t("validation.required")),
        })
        .refine(
          (d) => !isNickNameRequired(d.nationality) || !!d.nickname?.trim(),
          {
            message: t("validation.required"),
            path: ["nickname"],
            // Run even while other fields still have errors
            // (Zod skips whole-form rules until every field is valid by default).
            when: () => true,
          },
        ),
    [t],
  );

  type BasicInfoFormValues = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { isValid, errors },
  } = useForm<BasicInfoFormValues>({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: {
      firstName: details.firstName,
      middleName: details.middleName,
      lastName: details.lastName,
      nickname: details.nickName,
      gender: details.gender as "M" | "F",
      nationality: details.nationality,
      birthDate: details.birthDate,
      advertisingCode: details.advertisingCode,
    },
  });

  const errorFields = getErrorFieldLabels(errors, {
    lastName: t("remitter.lastName.label"),
    firstName: t("remitter.firstName.label"),
    middleName: t("remitter.middleName.label"),
    nationality: t("remitter.nationality.label"),
    nickname: t("remitter.nickname.label"),
    gender: t("remitter.gender.label"),
    birthDate: t("remitter.dateOfBirth.label"),
    advertisingCode: t("remitter.advertisingSource.label"),
  });

  const nationality = useWatch({ control, name: "nationality" });
  const showNickname = isNickNameRequired(nationality);

  // Nickname is hidden for Japanese nationals: reset its value *and* error.
  // A hidden field is never blurred again, so its error would otherwise stay.
  useEffect(() => {
    if (!showNickname) {
      setValue("nickname", "");
      clearErrors("nickname");
    }
  }, [showNickname, setValue]);

  const onSubmit = (data: BasicInfoFormValues) => {
    dispatch(
      updateRegistrationDetails({
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        nickName: data.nickname,
        gender: data.gender,
        nationality: data.nationality,
        birthDate: data.birthDate,
        advertisingCode: data.advertisingCode,
      }),
    );
    goNext("/(auth)/(register)/employment-info");
  };

  return (
    <AppScreen
      gradient
      header={
        <>
          {/* Header */}
          <AppHeader title={t("common.signUp")} />
          {/* Stepper */}
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
      {/* Section Header */}
      <RegisterSectionHeader
        number={1}
        progress={33}
        title={t("basicInfo.title")}
        subtitle={t("basicInfo.subtitle")}
      />

      <FieldsContainer>
        {/* Last Name */}
        <AppInput
          control={control}
          name="lastName"
          required
          label={t("remitter.lastName.label")}
          placeholder={t("remitter.lastName.placeholder")}
          maxLength={FieldLimits.lastName}
          autoCapitalize="words"
        />

        {/* First Name */}
        <AppInput
          control={control}
          name="firstName"
          required
          label={t("remitter.firstName.label")}
          placeholder={t("remitter.firstName.placeholder")}
          maxLength={FieldLimits.firstName}
          autoCapitalize="words"
        />

        {/* Middle Name */}
        <AppInput
          control={control}
          name="middleName"
          optional
          label={t("remitter.middleName.label")}
          hint={t("remitter.middleName.helper")}
          maxLength={FieldLimits.middleName}
          autoCapitalize="words"
        />

        {/* Nationality */}
        <AppSelect
          control={control}
          name="nationality"
          required
          label={t("remitter.nationality.label")}
          placeholder={t("remitter.nationality.placeholder")}
          options={nationalityOptions}
          pinnedValues={PINNED_NATIONALITY_CODES}
          groupByLetter
          showFlags
        />

        {/* Nickname: non-Japanese nationals only */}
        {showNickname && (
          <AppInput
            control={control}
            name="nickname"
            required
            label={t("remitter.nickname.label")}
            placeholder={t("remitter.nickname.placeholder")}
            maxLength={FieldLimits.nickName}
            autoCapitalize="words"
          />
        )}

        {/* Gender */}
        <AppGenderSelect
          control={control}
          name="gender"
          optional
          label={t("remitter.gender.label")}
        />

        {/* Date of Birth */}
        <AppDateInput
          control={control}
          name="birthDate"
          required
          leadingIcon="calendarLine"
          label={t("remitter.dateOfBirth.label")}
        />

        {/* Advertising Source */}
        <AppSelect
          control={control}
          name="advertisingCode"
          required
          label={t("remitter.advertisingSource.label")}
          placeholder={t("remitter.advertisingSource.placeholder")}
          options={advertisingOptions}
          sortAscending
        />
      </FieldsContainer>
    </AppScreen>
  );
}
