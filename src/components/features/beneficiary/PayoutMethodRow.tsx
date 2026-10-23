/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-21
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../../hooks/useAppTheme";
import { useTranslation } from "../../../hooks/useTranslation";
import { BeneficiaryPayout } from "../../../types";
import { Spacing } from "../../../constants/spacing";
import { BrandIcon, BrandIconName } from "../../icons";
import { AppText } from "../../common/AppText";
import { AppTextButton } from "../../common/AppTextButton";
import { isEWalletPayout } from "../../../utils/beneficiary";
import { PAYOUT_TYPE } from "../../../constants/beneficiary";

const ICON_BOX_SIZE = 36;
const ICON_BOX_RADIUS = 8;
const ICON_SIZE = 16;
// Between the account number and the currency ("123 456 · PHP")
const DETAILS_SEPARATOR = " · ";

type PayoutMethodRowProps = Readonly<{
  payout: BeneficiaryPayout;
  onDelete: () => void;
}>;

/**
 * One payout method
 *
 * @param param0
 */
export function PayoutMethodRow({ payout, onDelete }: PayoutMethodRowProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const details = [payout.accountNo, payout.currency]
    .filter(Boolean)
    .join(DETAILS_SEPARATOR);

  const getPayoutIconName = (payout: BeneficiaryPayout): BrandIconName => {
    if (isEWalletPayout(payout)) return "wallet02Line";

    if (payout.payoutType === PAYOUT_TYPE.CASH_PICKUP) return "bankNote01Line";

    if (payout.payoutType === PAYOUT_TYPE.BILLS_PAYMENT)
      return "receiptCheckLine";

    return "bankLine";
  };

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.iconBox,
          { backgroundColor: colors.payoutIconBackground },
        ]}
      >
        <BrandIcon
          name={getPayoutIconName(payout)}
          size={ICON_SIZE}
          color={colors.iconBrandPrimary}
        />
      </View>

      <View style={styles.texts}>
        <AppText
          typographyType="body2"
          weight="semibold"
          color={colors.textPrimary}
          numberOfLines={1}
        >
          {payout.bankName}
        </AppText>
        <AppText
          typographyType="body3"
          color={colors.textSecondary}
          numberOfLines={1}
        >
          {details}
        </AppText>
      </View>

      <View>
        <AppTextButton
          label={t("common.delete")}
          tone="danger"
          onPress={onDelete}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.s5,
    paddingVertical: Spacing.s5,
  },
  iconBox: {
    width: ICON_BOX_SIZE,
    height: ICON_BOX_SIZE,
    borderRadius: ICON_BOX_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
  texts: {
    flex: 1,
    gap: Spacing.s1,
  },
});
