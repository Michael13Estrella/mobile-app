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
import { PayoutSummary } from "../../../types";
import { Spacing } from "../../../constants/spacing";
import { BrandIcon, BrandIconName } from "../../icons";
import { AppText } from "../../common/AppText";
import { AppTextButton } from "../../common/AppTextButton";
import { PAYOUT_TYPE } from "../../../constants/payout";
import {
  isEWalletPayout,
  maskAccountNumber,
} from "../../../utils/beneficiary/payout";

const ICON_BOX_SIZE = 36;
const ICON_BOX_RADIUS = 8;
const ICON_SIZE = 16;
// Between the account number and the currency ("123 456 · PHP")
const DETAILS_SEPARATOR = " · ";

const getPayoutIconName = (payout: PayoutSummary): BrandIconName => {
  if (isEWalletPayout(payout)) return "wallet02Line";
  if (payout.payoutType === PAYOUT_TYPE.CASH_PICKUP) return "bankNote01Line";
  if (payout.payoutType === PAYOUT_TYPE.BILLS_PAYMENT)
    return "receiptCheckLine";

  return "bankLine";
};

type PayoutMethodRowProps = Readonly<{
  payout: PayoutSummary;
  // Shows "Delete" (e.g. Beneficiary Information); none without it
  onDelete?: () => void;
  // Only the last digits of the account number (e.g. Confirm Details)
  maskAccountNo?: boolean;
}>;

/**
 * One payout method of a beneficiary: its icon (bank, e-wallet, cash
 * pickup or bills payment), name, account number and currency, and an
 * optional Delete action.
 *
 * @example <PayoutMethodRow payout={payout} onDelete={() => confirmDelete(payout)} />
 */
export function PayoutMethodRow({
  payout,
  onDelete,
  maskAccountNo = false,
}: PayoutMethodRowProps) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();

  const accountNo = maskAccountNo
    ? maskAccountNumber(payout.accountNo)
    : payout.accountNo;

  const details = [accountNo, payout.currency]
    .filter(Boolean)
    .join(DETAILS_SEPARATOR);

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

      {onDelete && (
        <View>
          <AppTextButton
            label={t("common.delete")}
            tone="danger"
            onPress={onDelete}
          />
        </View>
      )}
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
