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

import { StyleSheet } from "react-native";
import { useTranslation } from "../../../../hooks/useTranslation";
import { PayoutSummary } from "../../../../types";
import { Spacing } from "../../../../constants/spacing";
import { DetailSection } from "../../../common/DetailSection";
import { PayoutMethodRow } from "../PayoutMethodRow";
import { AppTextButton } from "../../../common/AppTextButton";

type ConfirmPayoutCardProps = Readonly<{
  payout: PayoutSummary;
  // Back to the payout method's form
  onEdit: () => void;
}>;

/**
 * The "Payout method" card of Confirm Details: the new payout method, with
 * the account number masked.
 *
 * @example <ConfirmPayoutCard payout={toMetrobankPayoutSummary(payout)} onEdit={openPayoutForm} />
 */
export function ConfirmPayoutCard({ payout, onEdit }: ConfirmPayoutCardProps) {
  const { t } = useTranslation();

  return (
    <DetailSection
      title={t("addBeneficiary.confirm.payoutTitle")}
      action={
        <AppTextButton
          label={t("common.edit")}
          icon="edit02Line"
          onPress={onEdit}
        />
      }
      cardStyle={styles.card}
    >
      <PayoutMethodRow payout={payout} maskAccountNo />
    </DetailSection>
  );
}

const styles = StyleSheet.create({
  // The row sets its own vertical spacing (as in the payout methods card)
  card: {
    gap: Spacing.s0,
    paddingVertical: Spacing.s0,
  },
});
