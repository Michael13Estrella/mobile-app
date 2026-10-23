/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-22
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { FC, useState } from "react";
import {
  BENEFICIARY_PAYOUT_TYPES,
  BeneficiaryPayoutType,
  PAYOUT_TYPE,
} from "../../../../src/constants/beneficiary";
import { useAppTheme } from "../../../../src/hooks/useAppTheme";
import { useTranslation } from "../../../../src/hooks/useTranslation";
import { AppScreen } from "../../../../src/components/common/AppScreen";
import { AppText } from "../../../../src/components/common/AppText";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../../../src/constants/spacing";
import { PayoutMethodOption } from "../../../../src/components/features/beneficiary/payout/PayoutMethodOption";
import MetrobankAccountIcon from "../../../../assets/icons/payout/metrobank-account.svg";
import OtherBankIcon from "../../../../assets/icons/payout/other-bank.svg";
import CashPickupIcon from "../../../../assets/icons/payout/cash-pickup.svg";
import { SvgProps } from "react-native-svg";
import { AppHeader } from "../../../../src/components/common/AppHeader";
import { router } from "expo-router";
import { AppButton } from "../../../../src/components/common/AppButton";

// Each payout method's icon and its texts in addPayoutMethod.options (a
// Record, so a new payout type can't be missed)
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

export default function PayoutMethodScreen() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [payoutType, setPayoutType] = useState<BeneficiaryPayoutType | null>(
    null,
  );

  // TODO
  const handleNext = () => {};

  return (
    <AppScreen
      gradient
      header={
        <AppHeader
          title={t("addBeneficiary.title")}
          onBack={() => router.back()}
        />
      }
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
          {BENEFICIARY_PAYOUT_TYPES.map((type) => {
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
