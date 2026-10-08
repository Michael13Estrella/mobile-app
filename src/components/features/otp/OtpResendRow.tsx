import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { formatCooldown } from "../../../utils/formatCooldown";
import { AppText } from "../../common/AppText";
import { AppTextButton } from "../../common/AppTextButton";

type OtpResendRowProps = Readonly<{
  // Seconds until another code may be requested (0 = allowed now)
  cooldown: number;
  resending: boolean;
  disabled?: boolean;
  onResend: () => void;
}>;

// "Resend code in 00:30" while waiting, then a "Send another code" button.
export function OtpResendRow({
  cooldown,
  resending,
  disabled = false,
  onResend,
}: OtpResendRowProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  if (cooldown > 0) {
    return (
      <AppText typographyType="body3" color={colors.textSecondary}>
        {t("otp.resendIn")}{" "}
        <AppText
          typographyType="button3"
          weight="bold"
          color={colors.textBrandPrimary}
        >
          {formatCooldown(cooldown)}
        </AppText>
      </AppText>
    );
  }

  return (
    <AppTextButton
      label={t("otp.resend")}
      loading={resending}
      disabled={resending || disabled}
      align="left"
      onPress={onResend}
    />
  );
}
