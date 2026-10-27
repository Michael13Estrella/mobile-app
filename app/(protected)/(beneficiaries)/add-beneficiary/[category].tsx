/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-22
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { router, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../../../src/store";
import { BENEFICIARY_CATEGORIES } from "../../../../src/constants/beneficiary";
import { useEffect } from "react";
import {
  clearAddBeneficiary,
  setBeneficiaryDetails,
} from "../../../../src/store/slices/addBeneficiarySlice";
import { IndividualBeneficiaryForm } from "../../../../src/components/features/beneficiary/form/IndividualBeneficiaryForm";
import { IndividualFormValues } from "../../../../src/schemas/beneficiary/individualBeneficiarySchema";
import { useTranslation } from "../../../../src/hooks/useTranslation";
import {
  toCreateCorporateBeneficiary,
  toCreateIndividualBeneficiary,
  toOwnAccountFormValues,
} from "../../../../src/utils/beneficiary/beneficiary";
import { CorporateBeneficiaryForm } from "../../../../src/components/features/beneficiary/form/CorporateBeneficiaryForm";
import { CorporateFormValues } from "../../../../src/schemas/beneficiary/corporateBeneficiarySchema";
import { ROUTES } from "../../../../src/constants/routes";

const OWN_ACCOUNT_LOCKED_FIELDS = ["birthDate", "relationToBeneCode"] as const;

// Add Beneficiary: opened from the beneficiary type drawer; shows the form
// of the chosen type
export default function AddBeneficiaryScreen() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const params = useLocalSearchParams<{ category: string }>();
  const category = BENEFICIARY_CATEGORIES.find(
    (item) => item === params.category,
  );
  const profile = useAppSelector((s) => s.remitter.profile);

  // This screen stays open under the payout step, so it only unmounts when
  // the flow is left (back, of after saving): drop the draft then.
  useEffect(
    () => () => {
      dispatch(clearAddBeneficiary());
    },
    [dispatch],
  );

  // "Next": keep the beneficiary until the payout step saves both
  const handleIndividualSubmit = (values: IndividualFormValues) => {
    dispatch(
      setBeneficiaryDetails(
        toCreateIndividualBeneficiary(values, category === "ownAccount"),
      ),
    );
    router.push(ROUTES.ADD_BENEFICIARY_SELECT_PAYOUT_METHOD);
  };

  const handleCorporateSubmit = (values: CorporateFormValues) => {
    dispatch(setBeneficiaryDetails(toCreateCorporateBeneficiary(values)));
    router.push(ROUTES.ADD_BENEFICIARY_SELECT_PAYOUT_METHOD);
  };

  switch (category) {
    case "ownAccount":
      return (
        <IndividualBeneficiaryForm
          title={t("addBeneficiary.title")}
          submitLabel={t("common.next")}
          // The remitter: prefilled from their profile (names stay
          // editable); birth date and "Self" can't be changed
          initialValues={profile ? toOwnAccountFormValues(profile) : undefined}
          lockFields={OWN_ACCOUNT_LOCKED_FIELDS}
          onSubmit={handleIndividualSubmit}
        />
      );
    case "individual":
      return (
        <IndividualBeneficiaryForm
          title={t("addBeneficiary.title")}
          submitLabel={t("common.next")}
          onSubmit={handleIndividualSubmit}
        />
      );
    case "corporate":
      return (
        <CorporateBeneficiaryForm
          title={t("addBeneficiary.title")}
          submitLabel={t("common.next")}
          onSubmit={handleCorporateSubmit}
        />
      );
    default:
      return null;
  }
}
