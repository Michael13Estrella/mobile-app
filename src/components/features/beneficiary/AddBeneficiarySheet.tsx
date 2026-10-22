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

import { BENEFICIARY_CATEGORIES } from "../../../constants/beneficiary";
import { useTranslation } from "../../../hooks/useTranslation";
import { BeneficiaryCategory } from "../../../types";
import { DropdownOption } from "../../../utils/referenceData";
import { SelectSheet } from "../../form/select/SelectSheet";

type AddBeneficiarySheetProps = Readonly<{
  visible: boolean;
  onSelect: (category: BeneficiaryCategory) => void;
  onClose: () => void;
}>;

/**
 * The drawer of "Add beneficiary": asks for the beneficiary type (own
 * account, individual or corporate) before the form opens.
 *
 * @example <AddBeneficiarySheet visible={isOpen} onSelect={openForm} onClose={close} />
 */
export function AddBeneficiarySheet({
  visible,
  onSelect,
  onClose,
}: AddBeneficiarySheetProps) {
  const { t } = useTranslation();

  const options: DropdownOption[] = BENEFICIARY_CATEGORIES.map((category) => ({
    value: category,
    label: t(`addBeneficiary.drawer.types.${category}`),
  }));

  // Back from the option's string value to its category (no cast needed)
  const handleSelect = (option: DropdownOption) => {
    const category = BENEFICIARY_CATEGORIES.find(
      (item) => item === option.value,
    );
    if (category) onSelect(category);
  };

  return (
    <SelectSheet
      visible={visible}
      title={t("addBeneficiary.drawer.title")}
      options={options}
      onSelect={handleSelect}
      headerAction="cancel"
      onClear={onClose}
      onClose={onClose}
      fitContent={true}
    />
  );
}
