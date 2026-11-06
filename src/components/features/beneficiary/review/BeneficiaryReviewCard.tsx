/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-05
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { BENEFICIARY_TYPE } from "../../../../constants/beneficiary";
import { PAYOUT_TYPE } from "../../../../constants/payout";
import { useTranslation } from "../../../../hooks/useTranslation";
import { BeneficiaryDetail, BeneficiaryPayout } from "../../../../types";
import { getBeneficiaryCategory } from "../../../../utils/beneficiary/beneficiary";
import {
  formatMetrobankAccountNo,
  isEWalletPayout,
} from "../../../../utils/beneficiary/payout";
import { formatPersonName } from "../../../../utils/format/formatName";
import { AppCard } from "../../../common/AppCard";
import { AppDivider } from "../../../common/AppDivider";
import { DetailRow } from "../../../common/DetailRow";

type BeneficiaryReviewCardProps = Readonly<{
  beneficiary: BeneficiaryDetail;
  payout?: BeneficiaryPayout;
}>;

/**
 * The summary on the review result screen (approved or denied): the type,
 * who it is, and how they receive the money.
 *
 * @example <BeneficiaryReviewCard beneficiary={beneficiary} payout={payout} />
 */
export function BeneficiaryReviewCard({
  beneficiary,
  payout,
}: BeneficiaryReviewCardProps) {
  const { t } = useTranslation();

  const isMetrobank = payout?.payoutType === PAYOUT_TYPE.METROBANK_ACCOUNT;
  const isCashPickup = payout?.payoutType === PAYOUT_TYPE.CASH_PICKUP;

  // "Others" comes with the relationship typed in by the user
  const relationship =
    beneficiary.relationToBeneOthers.trim() || beneficiary.relationToBeneDesc;

  return (
    <AppCard>
      {/* Typed */}
      <DetailRow
        label={t("addBeneficiary.reviewResult.type")}
        value={t(
          `addBeneficiary.drawer.types.${getBeneficiaryCategory(beneficiary)}`,
        )}
      />

      <AppDivider marginVertical={false} />

      {/* Who: a person's names, or the company's name */}
      {beneficiary.beneficiaryType === BENEFICIARY_TYPE.CORPORATE ? (
        <DetailRow
          label={t("beneficiaryFields.companyName.label")}
          value={beneficiary.companyName}
        />
      ) : (
        <>
          <DetailRow
            label={t("beneficiaryFields.firstName.label")}
            value={formatPersonName(beneficiary.firstName)}
          />
          <DetailRow
            label={t("beneficiaryFields.lastName.label")}
            value={formatPersonName(beneficiary.lastName)}
          />
        </>
      )}
      <DetailRow
        label={t("beneficiaryDetails.relationship")}
        value={relationship}
      />

      {payout && (
        <>
          <AppDivider marginVertical={false} />

          <DetailRow
            label={t("addBeneficiary.submitted.payoutMethod")}
            value={
              isMetrobank
                ? t("addPayoutMethod.options.metrobankAccount.title")
                : payout.bankName
            }
          />
          {/* Cash pick-up: no account details */}
          {!isCashPickup && (
            <DetailRow
              label={t("addBeneficiary.submitted.accountNo")}
              value={
                isMetrobank
                  ? formatMetrobankAccountNo(payout.accountNo)
                  : payout.accountNo
              }
            />
          )}
          {/* An e-wallet is always PHP */}
          {!isCashPickup && !isEWalletPayout(payout) && (
            <DetailRow
              label={t("payoutFields.currency.label")}
              value={payout.currency}
            />
          )}
        </>
      )}
    </AppCard>
  );
}
