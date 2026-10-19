/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-19
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { BeneficiarySummary } from "../types";
import { formatPersonName } from "./formatName";

/**
 * The name to show for a beneficiary: its alias, otherwise the company name,
 * otherwise the person's name
 *
 * @param beneficiary - The beneficiary
 * @returns The display title
 * @example getBeneficiaryTitle({ beneAlias: "Juan Savings", … }); // "Juan Savings"
 */
export const getBeneficiaryTitle = (beneficiary: BeneficiarySummary): string =>
  formatPersonName(beneficiary.beneAlias.trim()) ||
  beneficiary.companyName.trim() ||
  formatPersonName(`${beneficiary.lastName} ${beneficiary.firstName}`);

export const matchesBeneficiarySearch = (
  beneficiary: BeneficiarySummary,
  query: string,
): boolean => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [
    beneficiary.beneAlias,
    beneficiary.firstName,
    beneficiary.middleName,
    beneficiary.lastName,
    beneficiary.companyName,
  ].some((field) => field.toLowerCase().includes(normalized));
};
