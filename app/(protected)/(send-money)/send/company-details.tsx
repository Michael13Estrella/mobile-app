/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-10
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { router } from "expo-router";
import { CompanyDetailsFormValues } from "../../../../src/schemas/remittance/companyDetailsSchema";
import { useAppDispatch, useAppSelector } from "../../../../src/store";
import { setCompanyDetails } from "../../../../src/store/slices/sendMoneySlice";
import { ROUTES } from "../../../../src/constants/routes";
import { CompanyDetailsForm } from "../../../../src/components/features/remittance/CompanyDetailsForm";

// Send Money's "Additional Details": asked for from COMPANY_DETAILS_MIN_AMOUNT,
// between the form and Review
export default function CompanyDetailsScreen() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.sendMoney.form);
  // Coming back from Review: what was entered before
  const companyDetails = useAppSelector((s) => s.sendMoney.companyDetails);

  // Only reachable through the Send Money form's Next, which sets the draft
  if (!form) return null;

  const handleSubmit = (values: CompanyDetailsFormValues) => {
    dispatch(setCompanyDetails(values));
    router.push(ROUTES.SEND_MONEY_REVIEW);
  };

  return (
    <CompanyDetailsForm
      initialValues={companyDetails ?? undefined}
      onSubmit={handleSubmit}
    />
  );
}
