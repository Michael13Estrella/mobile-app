/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-08-27
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useMemo, useState } from "react";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { useAppDispatch, useAppSelector } from "../../../src/store";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { referenceDataService } from "../../../src/services/registration/referenceDataService";
import { updateRegistrationDetails } from "../../../src/store/slices/registrationSlice";
import { router } from "expo-router";
import { AppInput } from "../../../src/components/form/AppInput";
import { AppButton } from "../../../src/components/common/AppButton";
import {
  HALF_WIDTH_ROMAJI_REGEX,
  POSTAL_CODE_REGEX,
} from "../../../src/constants/validation";
import { AppSelect } from "../../../src/components/form/AppSelect";
import { PREFECTURE_OPTIONS } from "../../../src/constants/prefectures";
import { FieldLimits } from "../../../src/constants/fieldLimits";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { AppHeader } from "../../../src/components/common/AppHeader";
import { RegisterStepper } from "../../../src/components/features/register/RegisterStepper";
import { RegisterSectionHeader } from "../../../src/components/features/register/RegisterSectionHeader";
import { AppPhoneInput } from "../../../src/components/form/AppPhoneInput";
import { AppPostalCodeInput } from "../../../src/components/form/AppPostalCodeInput";
import { FieldsContainer } from "../../../src/components/form/FieldsContainer";
import { FORM_VALIDATION_MODE } from "../../../src/constants/form";
import { isValidPhoneNumber } from "../../../src/utils/phone";
import { REMITTER_PHONE_COUNTRY } from "../../../src/constants/phone";
import { useRegisterStepNavigation } from "../../../src/hooks/useRegisterStepNavigation";
import { getErrorFieldLabels } from "../../../src/utils/formErrors";
import { FormErrorSummary } from "../../../src/components/form/FormErrorSummary";
import { findPrefectureValue } from "../../../src/utils/prefecture";

export default function RegisterContactInfoScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { goNext } = useRegisterStepNavigation();
  const details = useAppSelector((s) => s.registration.details);

  const [lookingUp, setLookingUp] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        postalCode: z
          .string()
          .regex(POSTAL_CODE_REGEX, t("validation.postalCodeInvalid")),
        prefecture: z
          .string()
          .min(1, t("validation.required"))
          .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly")),
        addressLine1: z // City/Ward/Town
          .string()
          .min(1, t("validation.required"))
          .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly")),
        addressLine2: z // Address
          .string()
          .min(1, t("validation.required"))
          .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly")),
        addressLine3: z // Street no., building name, room no.
          .string()
          .min(1, t("validation.required"))
          .regex(HALF_WIDTH_ROMAJI_REGEX, t("validation.halfWidthOnly")),
        mobile: z
          .string()
          .refine(
            (val) => !val || isValidPhoneNumber(REMITTER_PHONE_COUNTRY, val),
            {
              message: t("remitter.mobile.validation"),
            },
          ),
      }),
    [t],
  );

  type ContactInfoFormValues = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { isValid, errors },
  } = useForm<ContactInfoFormValues>({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: {
      postalCode: details.postalCode,
      prefecture: details.prefecture,
      addressLine1: details.addressLine1,
      addressLine2: details.addressLine2,
      addressLine3: details.addressLine3,
      mobile: details.mobile,
    },
  });

  const errorFields = getErrorFieldLabels(errors, {
    mobile: t("remitter.mobile.label"),
    postalCode: t("remitter.postalCode.label"),
    prefecture: t("remitter.prefecture.label"),
    addressLine1: t("remitter.city.label"),
    addressLine2: t("remitter.address.label"),
    addressLine3: t("remitter.streetNumber.label"),
  });

  const handleLookup = async () => {
    const postalCode = getValues("postalCode").trim();

    if (!POSTAL_CODE_REGEX.test(postalCode)) {
      setError("postalCode", { message: t("validation.postalCodeInvalid") });
      return;
    }

    setLookingUp(true);
    clearErrors("postalCode");
    try {
      const result = await referenceDataService.lookupPostal(postalCode);
      if (!result) {
        setError("postalCode", { message: t("errors.postalNotFound") });
        return;
      }

      setValue("prefecture", findPrefectureValue(result.cityOrPrefecture), {
        shouldValidate: true,
      });
      setValue("addressLine1", result.addressLine2, { shouldValidate: true });
      setValue("addressLine2", result.addressLine3, { shouldValidate: true });
    } finally {
      setLookingUp(false);
    }
  };

  const onSubmit = (data: {
    postalCode: string;
    prefecture: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3?: string;
    mobile?: string;
  }) => {
    const mobile = data.mobile ?? "";
    dispatch(
      updateRegistrationDetails({
        postalCode: data.postalCode,
        prefecture: data.prefecture,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        addressLine3: data.addressLine3 ?? "",
        // The country code is only sent together with a number.
        mobileCountryCode: mobile ? REMITTER_PHONE_COUNTRY.dialCode : "",
        mobile,
      }),
    );
    goNext("/(auth)/(register)/identity-info");
  };

  return (
    <AppScreen
      gradient
      header={
        <>
          {/* Header */}
          <AppHeader title={t("common.signUp")} onBack={() => router.back()} />
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
        number={3}
        progress={100}
        title={t("contactInfo.title")}
        subtitle={t("contactInfo.subtitle")}
      />

      <FieldsContainer>
        {/* Phone number */}
        <AppPhoneInput
          control={control}
          name="mobile"
          country={REMITTER_PHONE_COUNTRY}
          label={t("remitter.mobile.label")}
          optional
        />

        {/* Postal Code */}
        <AppPostalCodeInput
          control={control}
          name="postalCode"
          label={t("remitter.postalCode.label")}
          required
          onSearch={handleLookup}
          searching={lookingUp}
        />

        {/* Prefecture */}
        <AppSelect
          control={control}
          name="prefecture"
          label={t("remitter.prefecture.label")}
          placeholder={t("remitter.prefecture.placeholder")}
          options={PREFECTURE_OPTIONS}
          required
          sortAscending
        />

        {/* City/Ward/Town */}
        <AppInput
          control={control}
          name="addressLine1"
          label={t("remitter.city.label")}
          placeholder={t("remitter.city.placeholder")}
          maxLength={FieldLimits.addressLine1}
          required
        />

        {/* Address */}
        <AppInput
          control={control}
          name="addressLine2"
          label={t("remitter.address.label")}
          placeholder={t("remitter.address.placeholder")}
          maxLength={FieldLimits.addressLine2}
          required
          multiline
          numberOfLines={2}
        />

        {/* Street no., building name, room no. */}
        <AppInput
          control={control}
          name="addressLine3"
          label={t("remitter.streetNumber.label")}
          placeholder={t("remitter.streetNumber.placeholder")}
          maxLength={FieldLimits.addressLine3}
          required
          multiline
          numberOfLines={2}
          labelHelper={t("remitter.streetNumber.labelHelper")}
        />
      </FieldsContainer>
    </AppScreen>
  );
}
