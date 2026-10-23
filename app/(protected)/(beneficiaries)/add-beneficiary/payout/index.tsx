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

import { FC } from "react";
import { StyleSheet } from "react-native";
import MetrobankAccountIcon from "../../../../assets/icons/payout/metrobank-account.svg";
import OtherBankIcon from "../../../../assets/icons/payout/other-bank.svg";
import CashPickupIcon from "../../../../assets/icons/payout/cash-pickup.svg";
import { SvgProps } from "react-native-svg";
import { router } from "expo-router";
import {
  BeneficiaryPayoutType,
  PAYOUT_TYPE,
} from "../../../../../src/constants/payout";
import { useTranslation } from "../../../../../src/hooks/useTranslation";
import { Spacing } from "../../../../../src/constants/spacing";
import { PayoutMethodPicker } from "../../../../../src/components/features/beneficiary/payout/PayoutMethodPicker";
import { ROUTES } from "../../../../../src/constants/routes";

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

export default function SelectPayoutMethodScreen() {
  const { t } = useTranslation();

  const handleNext = (payoutType: BeneficiaryPayoutType) => {
    if (payoutType === PAYOUT_TYPE.METROBANK_ACCOUNT) {
      router.push(ROUTES.ADD_BENEFICIARY_METROBANK_ACCOUNT);
    }
  };

  return (
    <PayoutMethodPicker title={t("addBeneficiary.title")} onNext={handleNext} />
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
