/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useEffect, useMemo, useRef } from "react";
import { useBillers } from "../../../hooks/useBillers";
import { useTranslation } from "../../../hooks/useTranslation";
import {
  AddBillerFormValues,
  buildAddBillerSchema,
  EMPTY_ADD_BILLER_FORM,
} from "../../../schemas/biller/addBillerSchema";
import { Biller } from "../../../types";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FORM_VALIDATION_MODE } from "../../../constants/form";
import { getBillerFields } from "../../../utils/biller/billerFields";
import { DropdownOption } from "../../../utils/referenceData/referenceData";
import {
  BILLER_PHONE_COUNTRY_CODES,
  PHONE_COUNTRIES,
  PhoneCountryCode,
} from "../../../constants/phone";
import { getErrorFieldLabels } from "../../../utils/form/formErrors";
import { AppScreen } from "../../common/AppScreen";
import { AppHeader } from "../../common/AppHeader";
import { router } from "expo-router";
import { FormErrorSummary } from "../../form/FormErrorSummary";
import { AppButton } from "../../common/AppButton";
import { FieldsContainer } from "../../form/FieldsContainer";
import { AppSelect } from "../../form/AppSelect";
import { AppDigitsInput } from "../../form/AppDigitsInput";
import {
  CREDIT_CARD_NUMBER_LENGTH,
  CREDIT_CARD_NUMBER_TEMPLATE,
} from "../../../constants/biller";
import { AppInput } from "../../form/AppInput";
import { AppPhoneInput } from "../../form/AppPhoneInput";

// The fields that depend on the biller: a new biller starts them over
const BILLER_DETAIL_FIELDS = [
  "subscriberNo",
  "docRefNo",
  "telNo",
] as const satisfies readonly (keyof AddBillerFormValues)[];

type AddBillerFormProps = Readonly<{
  isSubmitting?: boolean;
  // biller: the picked one, for the request and the screens after this one
  onSubmit: (values: AddBillerFormValues, biller: Biller) => void;
}>;

/**
 * The Add Biller form: the biller, then only the fields its flags ask for
 * (subscriber number or credit card number, docs number, buyer's
 * telephone number).
 * Only collects and validates; the screen decides what happens next.
 *
 * @example <AddBillerForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
 */
export function AddBillerForm({
  isSubmitting = false,
  onSubmit,
}: AddBillerFormProps) {
  const { t } = useTranslation();
  const { billers } = useBillers();

  const schema = useMemo(() => buildAddBillerSchema(t, billers), [t, billers]);

  const {
    control,
    handleSubmit,
    resetField,
    setValue,
    formState: { isValid, errors },
  } = useForm<AddBillerFormValues>({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: EMPTY_ADD_BILLER_FORM,
  });

  const utilityCode = useWatch({ control, name: "utilityCode" });
  const telCountry = useWatch({ control, name: "telCountry" });

  const biller = billers.find((item) => item.utilityCode === utilityCode);
  const fields = getBillerFields(biller);

  // Another biller asks for other fields: start its details over
  const previousUtilityCode = useRef(utilityCode);
  useEffect(() => {
    if (previousUtilityCode.current === utilityCode) return;
    previousUtilityCode.current = utilityCode;
    BILLER_DETAIL_FIELDS.forEach((field) => resetField(field));
  }, [utilityCode, resetField]);

  const billerOptions = useMemo<DropdownOption[]>(
    () =>
      billers.map(({ utilityCode: value, utilityDesc: label }) => ({
        value,
        label,
      })),
    [billers],
  );

  // AppPhoneInput clears the number itself; only the biller's countries are kept
  const handleCountryChange = (code: PhoneCountryCode) => {
    const billerCountry = BILLER_PHONE_COUNTRY_CODES.find(
      (item) => item === code,
    );
    if (billerCountry) setValue("telCountry", billerCountry);
  };

  const submit = (values: AddBillerFormValues) => {
    if (!biller) return;
    onSubmit(values, biller);
  };

  const subscriberNoLabel = fields.isCreditCard
    ? t("billerFields.creditCardNo.label")
    : t("billerFields.subscriberNo.label");

  const errorFields = getErrorFieldLabels(errors, {
    utilityCode: t("billerFields.biller.label"),
    subscriberNo: subscriberNoLabel,
    docRefNo: t("billerFields.docRefNo.label"),
    telNo: t("billerFields.telNo.label"),
  });

  return (
    <AppScreen
      gradient
      header={
        <AppHeader
          title={t("payBills.addBiller.headerTitle")}
          onBack={() => router.back()}
        />
      }
      footer={
        <>
          <FormErrorSummary fields={errorFields} />

          <AppButton
            label={t("common.save")}
            variant="gradient"
            disabled={!isValid}
            loading={isSubmitting}
            onPress={handleSubmit(submit)}
          />
        </>
      }
    >
      <FieldsContainer>
        <AppSelect
          control={control}
          name="utilityCode"
          label={t("billerFields.biller.label")}
          placeholder={t("billerFields.biller.placeholder")}
          options={billerOptions}
          fitContent
        />
        {fields.subscriberNo &&
          (fields.isCreditCard ? (
            <AppDigitsInput
              control={control}
              name="subscriberNo"
              template={CREDIT_CARD_NUMBER_TEMPLATE}
              label={subscriberNoLabel}
              hint={t("billerFields.creditCardNo.hint", {
                count: CREDIT_CARD_NUMBER_LENGTH,
              })}
            />
          ) : (
            <AppInput
              control={control}
              name="subscriberNo"
              label={subscriberNoLabel}
              placeholder={t("billerFields.subscriberNo.placeholder")}
            />
          ))}

        {fields.docRefNo && (
          <AppInput
            control={control}
            name="docRefNo"
            label={t("billerFields.docRefNo.label")}
            placeholder={t("billerFields.docRefNo.placeholder")}
            autoCapitalize="characters"
          />
        )}

        {fields.telNo && (
          <AppPhoneInput
            control={control}
            name="telNo"
            label={t("billerFields.telNo.label")}
            country={PHONE_COUNTRIES[telCountry]}
            countries={BILLER_PHONE_COUNTRY_CODES}
            onCountryChange={handleCountryChange}
          />
        )}
      </FieldsContainer>
    </AppScreen>
  );
}
