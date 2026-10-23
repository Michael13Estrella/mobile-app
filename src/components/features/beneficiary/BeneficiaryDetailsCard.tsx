import { BENEFICIARY_TYPE } from "../../../constants/beneficiary";
import { BENEFICIARY_PHONE_COUNTRY } from "../../../constants/phone";
import { GENDER_OPTIONS } from "../../../constants/userFields";
import { useTranslation } from "../../../hooks/useTranslation";
import { BeneficiaryDetail } from "../../../types";
import { getBeneficiaryAddress } from "../../../utils/beneficiary/beneficiary";
import { formatIsoDate } from "../../../utils/format/formatDate";
import { formatPhoneNumber } from "../../../utils/format/phone";
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
    <DetailSection title={t("beneficiaryDetails.title")}>
      <DetailRow
        label={t("beneficiaryDetails.nickname")}
        value={beneficiary.beneAlias}
      />

      <DetailRow
        label={t("beneficiaryDetails.relationship")}
        value={relationship}
      />

      {isCorporate ? (
        <DetailRow
          label={t("beneficiaryDetails.officeTelNo")}
          value={beneficiary.officeTelNo}
        />
      ) : (
        <DetailRow label={t("beneficiaryDetails.mobileNo")} value={mobile} />
      )}

      <DetailRow
        label={t("beneficiaryDetails.address")}
        value={getBeneficiaryAddress(beneficiary)}
      />

      {!isCorporate && (
        <DetailRow
          label={t("beneficiaryFields.gender.label")}
          value={genderLabelKey && t(genderLabelKey)}
        />
      )}

      <DetailRow
        label={
          isCorporate
            ? t("beneficiaryFields.establishDate.label")
            : t("beneficiaryFields.dateOfBirth.label")
        }
        value={date && formatIsoDate(date, locale)}
      />
    </DetailSection>
  );
}
