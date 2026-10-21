import { BENEFICIARY_TYPE } from "../../../constants/beneficiary";
import { BENEFICIARY_PHONE_COUNTRY } from "../../../constants/phone";
import { GENDER_OPTIONS } from "../../../constants/userFields";
import { useTranslation } from "../../../hooks/useTranslation";
import { BeneficiaryDetail } from "../../../types";
import { getBeneficiaryAddress } from "../../../utils/beneficiary";
import { formatIsoDate } from "../../../utils/formatDate";
import { formatPhoneNumber } from "../../../utils/phone";
import { DetailRow } from "../../common/DetailRow";
import { DetailSection } from "../../common/DetailSection";

type BeneficiaryDetailsCardProps = Readonly<{
  beneficiary: BeneficiaryDetail;
}>;

/**
 * The "Beneficiary details" card of Beneficiary Information. Corporate
 * beneficiaries show the office phone and the date of establishment instead
 * of the mobile number, gender and date of birth
 *
 * @example <BeneficiaryDetailsCard beneficiary={data.beneficiary} />
 */
export function BeneficiaryDetailsCard({
  beneficiary,
}: BeneficiaryDetailsCardProps) {
  const { t, locale } = useTranslation();
  const isCorporate =
    beneficiary.beneficiaryType === BENEFICIARY_TYPE.CORPORATE;

  // "Others" comes with the relationship typed in by the user
  const relationship =
    beneficiary.relationToBeneOthers.trim() || beneficiary.relationToBeneDesc;

  const mobile =
    beneficiary.mobileNo &&
    formatPhoneNumber(BENEFICIARY_PHONE_COUNTRY, beneficiary.mobileNo);

  const genderLabelKey = GENDER_OPTIONS.find(
    (option) => option.value === beneficiary.gender,
  )?.labelKey;

  // ISO date-time -> its date part only (no time zone shift)
  const date = beneficiary.birthOrEstablishDate?.split("T").at(0) ?? "";

  return (
    <DetailSection title={t("beneficiary.details.detailsTitle")}>
      <DetailRow
        label={t("beneficiary.details.nickname")}
        value={beneficiary.beneAlias}
      />

      <DetailRow
        label={t("beneficiary.details.relationship")}
        value={relationship}
      />

      {isCorporate ? (
        <DetailRow
          label={t("beneficiary.details.officePhone")}
          value={beneficiary.officeTelNo}
        />
      ) : (
        <DetailRow label={t("beneficiary.details.mobile")} value={mobile} />
      )}

      <DetailRow
        label={t("beneficiary.details.address")}
        value={getBeneficiaryAddress(beneficiary)}
      />

      {!isCorporate && (
        <DetailRow
          label={t("beneficiary.details.gender")}
          value={genderLabelKey && t(genderLabelKey)}
        />
      )}

      <DetailRow
        label={
          isCorporate
            ? t("beneficiary.details.establishDate")
            : t("beneficiary.details.birthDate")
        }
        value={date && formatIsoDate(date, locale)}
      />
    </DetailSection>
  );
}
