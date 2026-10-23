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

import { useState } from "react";
import { BrandIconName } from "../../../../src/components/icons";
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

// Each payout method's icon and its texts in addPayoutMethod.options (a
// Record, so a new payout type can't be missed)
const PAYOUT_METHOD_OPTIONS = {
  [PAYOUT_TYPE.METROBANK_ACCOUNT]: {
    icon: "bankLine",
    textKey: "metrobankAccount",
  },
  [PAYOUT_TYPE.OTHER_BANKS]: {
    icon: "arrowNarrowRightLine",
    textKey: "otherBanks",
  },
  [PAYOUT_TYPE.CASH_PICKUP]: {
    icon: "bankNote01_16_Line",
    textKey: "cashPickup",
  },
} as const satisfies Record<
  BeneficiaryPayoutType,
  Readonly<{ icon: BrandIconName; textKey: string }>
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
    <AppScreen gradient>
      <AppText typographyType="body2" color={colors.textPrimary}>
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
              description={t(`addPayoutMethod.options.${textKey}.description`)}
              selected={payoutType === type}
              onPress={() => setPayoutType(type)}
            />
          );
        })}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: Spacing.s5,
  },
});
