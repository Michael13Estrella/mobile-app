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

import { BENEFICIARY_TYPE } from "../../../../constants/beneficiary";
import { PAYOUT_TYPE } from "../../../../constants/payout";
import { useReferenceData } from "../../../../hooks/useReferenceData";
import { useTranslation } from "../../../../hooks/useTranslation";
import {
  CreateBeneficiaryDetails,
  CreateBeneficiaryPayout,
  PayoutSummary,
} from "../../../../types";
import { getBeneficiaryCategory } from "../../../../utils/beneficiary/beneficiary";
import {
  formatMetrobankAccountNo,
  isEWalletBankCode,
} from "../../../../utils/beneficiary/payout";
import { formatPersonName } from "../../../../utils/format/formatName";
import { getReferenceLabel } from "../../../../utils/referenceData/referenceData";
import { AppCard } from "../../../common/AppCard";
import { AppDivider } from "../../../common/AppDivider";
import { DetailRow } from "../../../common/DetailRow";

type SubmittedBeneficiaryCardProps = Readonly<{
  details: CreateBeneficiaryDetails;
  payout: CreateBeneficiaryPayout;
  payoutSummary: PayoutSummary;
}>;

/**
 * The summary on "Beneficiary under review": the type, who it is, and how
 * they receive the money, as just submitted.
 *
 * @example <SubmittedBeneficiaryCard details={details} payout={payout} payoutSummary={payoutSummary} />
 */
export function SubmittedBeneficiaryCard({
  details,
  payout,
  payoutSummary,
}: SubmittedBeneficiaryCardProps) {
  const { t, locale } = useTranslation();
  const { items: relationships } = useReferenceData("relationWithBene");

  return (
    <AppCard>
      {/* Type */}
      <DetailRow
        label={t("addBeneficiary.confirm.type")}
        value={t(
          `addBeneficiary.drawer.types.${getBeneficiaryCategory(details)}`,
        )}
      />

      <AppDivider marginVertical={false} />

      {/* Who: a person's names, or the company's name */}
      {details.beneficiaryType === BENEFICIARY_TYPE.INDIVIDUAL ? (
        <>
          <DetailRow
            label={t("beneficiaryFields.firstName.label")}
            value={formatPersonName(details.firstName)}
          />
          <DetailRow
            label={t("beneficiaryFields.lastName.label")}
            value={formatPersonName(details.lastName)}
          />
        </>
      ) : (
        <DetailRow
          label={t("beneficiaryFields.companyName.label")}
          value={details.companyName}
        />
      )}
      <DetailRow
        label={t("beneficiaryDetails.relationship")}
        value={getReferenceLabel(
          relationships,
          details.relationToBeneCode,
          locale,
        )}
      />

      <AppDivider marginVertical={false} />

      {/* Metrobank Account */}
      {payout.payoutType === PAYOUT_TYPE.METROBANK_ACCOUNT && (
        <>
          <DetailRow
            label={t("addBeneficiary.submitted.payoutMethod")}
            value={t("addPayoutMethod.options.metrobankAccount.title")}
          />
          <DetailRow
            label={t("addBeneficiary.submitted.accountNo")}
            value={formatMetrobankAccountNo(payout.caAccountNo)}
          />
          <DetailRow
            label={t("payoutFields.currency.label")}
            value={payout.currency}
          />
        </>
      )}
      {/* Other bank / e-wallet (an e-wallet is always PHP) */}
      {payout.payoutType === PAYOUT_TYPE.OTHER_BANKS && (
        <>
          <DetailRow
            label={t("addBeneficiary.submitted.payoutMethod")}
            value={payoutSummary.bankName}
          />
          <DetailRow
            label={t("addBeneficiary.submitted.accountNo")}
            value={payoutSummary.accountNo}
          />
          {!isEWalletBankCode(payout.obBankNameCode) && (
            <DetailRow
              label={t("payoutFields.currency.label")}
              value={payout.currency}
            />
          )}
        </>
      )}

      {/* TODO: cash pick-up */}
    </AppCard>
  );
}
