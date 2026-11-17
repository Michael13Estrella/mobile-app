/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { useTranslation } from "../../../hooks/useTranslation";
import { EnrolledBiller } from "../../../types";
import {
  isCreditCardEnrolledBiller,
  maskCardNumber,
} from "../../../utils/biller/enrolledBillers";
import { formatInternationalPhoneNumber } from "../../../utils/format/phone";
import { DetailRow } from "../../common/DetailRow";
import { DetailSection } from "../../common/DetailSection";

type BillerDetailsCardProps = Readonly<{
  biller: EnrolledBiller;
}>;

/**
 * "BILLER DETAILS" on Biller Information: the biller, its subscriber
 * number (a card's last digits only), and the docs number and buyer's
 * phone when it has them.
 *
 * @example <BillerDetailsCard biller={biller} />
 */
export function BillerDetailsCard({ biller }: BillerDetailsCardProps) {
  const { t } = useTranslation();
  const isCreditCard = isCreditCardEnrolledBiller(biller);

  return (
    <DetailSection title={t("billerDetails.sectionTitle")}>
      <DetailRow
        label={t("billerDetails.biller")}
        value={biller.bpSubscriberName}
      />
      <DetailRow
        label={
          isCreditCard
            ? t("billerDetails.creditCardNo")
            : t("billerDetails.subscriberNo")
        }
        value={
          isCreditCard
            ? maskCardNumber(biller.bpSubscriberNo)
            : biller.bpSubscriberNo
        }
      />
      {!!biller.bpDocuRefNo && (
        <DetailRow
          label={t("billerDetails.docRefNo")}
          value={biller.bpDocuRefNo}
        />
      )}
      {!!biller.bpTelno && (
        <DetailRow
          label={t("billerDetails.telNo")}
          value={formatInternationalPhoneNumber(biller.bpTelno)}
        />
      )}
    </DetailSection>
  );
}
