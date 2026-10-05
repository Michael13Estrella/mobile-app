import { useMemo, useState } from "react";
import { useAppTheme } from "../../../src/hooks/useAppTheme";
import { useTranslation } from "../../../src/hooks/useTranslation";
import { useAppDispatch } from "../../../src/store";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { setAccount } from "../../../src/store/slices/registrationSlice";
import { router } from "expo-router";
import { Text } from "react-native";
import { AppButton } from "../../../src/components/common/AppButton";
import { AppInput } from "../../../src/components/form/AppInput";
import { useRegistration } from "../../../src/hooks/useRegistration";
import { PASSWORD_COMPLEXITY_REGEX } from "../../../src/constants/validation";
import { AppPasswordInput } from "../../../src/components/form/AppPasswordInput";
import { AppHeader } from "../../../src/components/common/AppHeader";
import { AppScreen } from "../../../src/components/common/AppScreen";
import { RegisterStepper } from "../../../src/components/features/register/RegisterStepper";
import { FieldsContainer } from "../../../src/components/form/FieldsContainer";
import { RegisterSectionHeader } from "../../../src/components/features/register/RegisterSectionHeader";
import { FORM_VALIDATION_MODE } from "../../../src/constants/form";

export default function RegisterAccountScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { checkEmail } = useRegistration();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      z
        .object({
          email: z.email(t("validation.invalidEmail")),
          password: z
            .string()
            .regex(
              PASSWORD_COMPLEXITY_REGEX,
              t("validation.passwordComplexity"),
            ),
        })
        // password should not be the same with email/username
        .refine(
          (d) => {
            const email = d.email.trim().toLowerCase();
            const localPart = email.split("@")[0];
            const password = d.password.toLowerCase();
            if (!email || !password) return true;
            if (password.includes(email)) return false;
            return !localPart || !password.includes(localPart);
          },
          {
            message: t("validation.passwordContainsEmail"),
            path: ["password"],
          },
        ),
    [t],
  );

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: zodResolver(schema),
    ...FORM_VALIDATION_MODE,
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    const email = data.email.trim();
    setSubmitting(true);
    setError(null);

    try {
      dispatch(setAccount({ email, password: data.password }));

      const result = await checkEmail(email);
      if (!result.ok) {
        setError(result.message ?? t("errors.generic"));
        return;
      }

      router.push("/(auth)/(register)/verify-email");
    } finally {
      setSubmitting(false);
    }

    dispatch(
      setAccount({
        email: data.email.toLowerCase().trim(),
        password: data.password,
      }),
    );
  };

  return (
    <AppScreen
      gradient
      header={
        <>
          <AppHeader
            title={t("common.signUp")}
            onBack={() => {
              router.back();
            }}
          />
          <RegisterStepper currentStep={0} />
        </>
      }
      footer={
        <AppButton
          label={t("common.next")}
          variant="gradient"
          loading={submitting}
          disabled={!isValid || submitting}
          onPress={handleSubmit(onSubmit)}
        />
      }
    >
      {/* Section Header */}
      <RegisterSectionHeader
        title={t("loginDetails.title")}
        subtitle={t("loginDetails.subtitle")}
      />

      <FieldsContainer>
        {/* Email address */}
        <AppInput
          control={control}
          name="email"
          label={t("login.email.label")}
          placeholder={t("login.email.placeholder")}
          leadingIcon="mail02Line"
          keyboardType="default"
          autoCapitalize="none"
        />

        {/* Password */}
        <AppPasswordInput
          control={control}
          name="password"
          label={t("login.password.label")}
          placeholder={t("login.password.placeholder")}
          leadingIcon="lockLine"
          showRequirements
        />
      </FieldsContainer>

      {!!error && <Text style={{ color: colors.error }}>{error}</Text>}
    </AppScreen>
  );
}
