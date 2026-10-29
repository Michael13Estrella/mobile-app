/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-23
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { SvgProps } from "react-native-svg";
import CashPickupIcon from "../../../../../assets/icons/payout/cash-pickup.svg";
import MetrobankAccountIcon from "../../../../../assets/icons/payout/metrobank-account.svg";
import OtherBankIcon from "../../../../../assets/icons/payout/other-bank.svg";
import {
  BENEFICIARY_PAYOUT_TYPES,
  BeneficiaryPayoutType,
  PAYOUT_TYPE,
} from "../../../../constants/payout";
import { Spacing } from "../../../../constants/spacing";
import { useAppTheme } from "../../../../hooks/useAppTheme";
import { useTranslation } from "../../../../hooks/useTranslation";
import { AppButton } from "../../../common/AppButton";
import { AppHeader } from "../../../common/AppHeader";
import { AppScreen } from "../../../common/AppScreen";
import { AppText } from "../../../common/AppText";
import { PayoutMethodOption } from "./PayoutMethodOption";

// Each payout method's illustration and its texts in addPayoutMethod.options
// (a Record, so a new payout type can't be missed)
const PAYOUT_METHOD_OPTIONS = {
  [PAYOUT_TYPE.METROBANK_ACCOUNT]: {
    icon: MetrobankAccountIcon,
    textKey: "metrobankAccount",
  },
  [PAYOUT_TYPE.OTHER_BANKS]: {
    icon: OtherBankIcon,
    textKey: "otherBanks",
  },
  [PAYOUT_TYPE.CASH_PICKUP]: {
    icon: CashPickupIcon,
    textKey: "cashPickup",
  },
} as const satisfies Record<
  BeneficiaryPayoutType,
  Readonly<{ icon: FC<SvgProps>; textKey: string }>
>;

type PayoutMethodPickerProps = Readonly<{
  // "Add Beneficiary" / "Add Payout Method"
  title: string;
  // The chosen payout type, when Next is tapped
  onNext: (payoutType: BeneficiaryPayoutType) => void;
  hideCashPickup?: boolean;
}>;

/**
 * The "Select payout method" screen: one card per payout type, then Next.
 * Only reports the choice; the screen using it decides where Next goes
 * (add beneficiary, add payout method).
 *
 * @example <PayoutMethodPicker title={t("addBeneficiary.title")} onNext={openPayoutForm} />
 */
export function PayoutMethodPicker({
  title,
  onNext,
  hideCashPickup = false,
}: PayoutMethodPickerProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [payoutType, setPayoutType] = useState<BeneficiaryPayoutType | null>(
    null,
  );

  const handleNext = () => {
    if (payoutType) onNext(payoutType);
  };

  return (
    <AppScreen
      gradient
      header={<AppHeader title={title} onBack={() => router.back()} />}
      footer={
        <AppButton
          label={t("common.next")}
          variant="gradient"
          disabled={!payoutType}
          onPress={handleNext}
        />
      }
    >
      <View style={styles.container}>
        <AppText typographyType="label2" color={colors.textPrimary}>
          {t("addPayoutMethod.title")}
        </AppText>

        <View style={styles.options} accessibilityRole="radiogroup">
          {BENEFICIARY_PAYOUT_TYPES.filter(
            (type) => !(hideCashPickup && type === PAYOUT_TYPE.CASH_PICKUP),
          ).map((type) => {
            const { icon, textKey } = PAYOUT_METHOD_OPTIONS[type];

            return (
              <PayoutMethodOption
                key={type}
                icon={icon}
                title={t(`addPayoutMethod.options.${textKey}.title`)}
                description={t(
                  `addPayoutMethod.options.${textKey}.description`,
                )}
                selected={payoutType === type}
                onPress={() => setPayoutType(type)}
              />
            );
          })}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.s3,
  },
  options: {
    gap: Spacing.s5,
  },
});
