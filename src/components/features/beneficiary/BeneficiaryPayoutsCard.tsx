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

import { BeneficiaryPayout } from "../../../types";
import { useTranslation } from "../../../hooks/useTranslation";
import { DetailSection } from "../../common/DetailSection";
import { PayoutMethodRow } from "./PayoutMethodRow";
import { Fragment } from "react";
import { AppDivider } from "../../common/AppDivider";
import { StyleSheet, View } from "react-native";
import { Spacing } from "../../../constants/spacing";
import { AppTextButton } from "../../common/AppTextButton";
import { MIN_BENEFICIARY_PAYOUTS } from "../../../constants/payout";

type BeneficiaryPayoutsCardProps = Readonly<{
  payouts: readonly BeneficiaryPayout[];
  onDeletePayout: (payout: BeneficiaryPayout) => void;
  onAddPayout: () => void;
}>;

/**
 * The "Payout methods" card of Beneficiary Information: one row per payout
 * method (with Delete, unless it's the only one), then "+ Add payout method".
 *
 * @example <BeneficiaryPayoutsCard payouts={data.payouts} onDeletePayout={…} onAddPayout={…} />
 */
export function BeneficiaryPayoutsCard({
  payouts,
  onDeletePayout,
  onAddPayout,
}: BeneficiaryPayoutsCardProps) {
  const { t } = useTranslation();

  // The last payout method can't be deleted (no Delete on its row)
  const canDelete = payouts.length > MIN_BENEFICIARY_PAYOUTS;

  return (
    <DetailSection
      title={t("beneficiaryDetails.payoutsTitle")}
      cardStyle={styles.card}
    >
      {payouts.map((payout) => (
        <Fragment key={payout.payoutId}>
          <PayoutMethodRow
            payout={payout}
            onDelete={canDelete ? () => onDeletePayout(payout) : undefined}
          />
          <AppDivider marginVertical={false} style={styles.fullWidth} />
        </Fragment>
      ))}

      <View style={styles.button}>
        <AppTextButton
          label={t("beneficiaryDetails.addPayout")}
          icon="plusLine"
          onPress={onAddPayout}
        />
      </View>
    </DetailSection>
  );
}

const styles = StyleSheet.create({
  // The rows and the button set their own spacing (a row is taller than
  // the button), so the card adds none
  card: {
    gap: Spacing.s0,
    paddingVertical: Spacing.s0,
  },
  // Edge to edge in the card: cancel AppCard's padding
  fullWidth: {
    width: "auto",
    marginHorizontal: -Spacing.s5,
  },
  button: {
    marginVertical: Spacing.s3,
  },
});
