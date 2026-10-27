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
import { BENEFICIARY_PHONE_COUNTRY } from "../../../../constants/phone";
import { GENDER_OPTIONS } from "../../../../constants/userFields";
import { usePhilippineAreas } from "../../../../hooks/usePhilippineArea";
import { useReferenceData } from "../../../../hooks/useReferenceData";
import { useTranslation } from "../../../../hooks/useTranslation";
import { CreateBeneficiaryDetails } from "../../../../types";
import { getBeneficiaryCategory } from "../../../../utils/beneficiary/beneficiary";
import { formatIsoDate } from "../../../../utils/format/formatDate";
import { formatPhoneNumber } from "../../../../utils/format/phone";
import { getReferenceLabel } from "../../../../utils/referenceData/referenceData";
import { AppTextButton } from "../../../common/AppTextButton";
import { DetailRow } from "../../../common/DetailRow";
import { DetailSection } from "../../../common/DetailSection";

type ConfirmBeneficiaryCardProps = Readonly<{
  details: CreateBeneficiaryDetails;
  // Back to the beneficiary form
  onEdit: () => void;
}>;

/**
 * The "Beneficiary details" card of Confirm Details: what the user entered,
 * with the codes shown as names (relationship, city, province).
 *
 * @example <ConfirmBeneficiaryCard details={draft.details} onEdit={openForm} />
 */
export function ConfirmBeneficiaryCard({
  details,
  onEdit,
}: ConfirmBeneficiaryCardProps) {
  const { t, locale } = useTranslation();
  const { items: relationships } = useReferenceData("relationWithBene");
  const { provinces, towns } = usePhilippineAreas(details.cityProvCode);

  const category = getBeneficiaryCategory(details);
  const address = [
    details.address1,
    details.address2,
    towns.find((town) => town.code === details.zipPosCode)?.name,
    provinces.find((province) => province.code === details.cityProvCode)?.name,
  ]
    .filter(Boolean)
    .join(",\n");

  return (
    <DetailSection
      title={t("beneficiaryDetails.detailsTitle")}
      action={
        <AppTextButton
          label={t("common.edit")}
          icon="edit02Line"
          onPress={onEdit}
        />
      }
    >
      <DetailRow
        label={t("addBeneficiary.confirm.type")}
        value={t(`addBeneficiary.drawer.types.${category}`)}
      />

      {details.beneficiaryType === BENEFICIARY_TYPE.INDIVIDUAL ? (
        <>
          <DetailRow
            label={t("beneficiaryDetails.birthDate")}
            value={
              details.birthOrEstablishDate &&
              formatIsoDate(details.birthOrEstablishDate, locale)
            }
          />
          <DetailRow
            label={t("beneficiaryDetails.gender")}
            value={(() => {
              const labelKey = GENDER_OPTIONS.find(
                (option) => option.value === details.gender,
              )?.labelKey;

              return labelKey && t(labelKey);
            })()}
          />
        </>
      ) : (
        <DetailRow
          label={t("beneficiaryDetails.officeTelNo")}
          value={formatPhoneNumber(
            BENEFICIARY_PHONE_COUNTRY,
            details.officeTelNo,
          )}
        />
      )}

      <DetailRow label={t("beneficiaryDetails.address")} value={address} />
      <DetailRow
        label={t("beneficiaryDetails.relationship")}
        value={getReferenceLabel(
          relationships,
          details.relationToBeneCode,
          locale,
        )}
      />
    </DetailSection>
  );
}
