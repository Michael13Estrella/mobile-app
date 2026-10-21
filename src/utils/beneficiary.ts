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

import { E_WALLET_BANK_CODES } from "../constants/beneficiary";
import { PAYOUT_TYPE } from "../constants/transaction";
import {
  BeneficiaryDetail,
  BeneficiaryPayout,
  BeneficiarySummary,
} from "../types";
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

type NameFields = Pick<
  BeneficiaryDetail,
  "firstName" | "middleName" | "lastName" | "companyName"
>;

/**
 * A beneficiary's full name for display: the company name, or the person's
 * first, middle and last name (formatted; it comes in capitals).
 *
 * @param beneficiary - The name fields
 * @returns The full name.
 * @example getBeneficiaryFullName({ firstName: "JOSH", middleName: "CULLEN", lastName: "SANTOS", companyName: "" }); // "Josh Cullen Santos"
 */
export const getBeneficiaryFullName = (beneficiary: NameFields): string =>
  beneficiary.companyName.trim() ||
  formatPersonName(
    [beneficiary.firstName, beneficiary.middleName, beneficiary.lastName]
      .filter((part) => part.trim())
      .join(" "),
  );

/**
 * The beneficiary's address on separate lines, empty parts left out.
 *
 * @param beneficiary - The address fields.
 * @returns The address lines joined with ",\n", or "" without an address.
 * @example getBeneficiaryAddress({ address1: "1999 Anastacio Street", address2: "Guadalupe Nuevo", zipPosCode: "1212", … });
 */
export const getBeneficiaryAddress = (
  beneficiary: Pick<BeneficiaryDetail, "address1" | "address2" | "zipPosCode">,
): string =>
  [beneficiary.address1, beneficiary.address2, beneficiary.zipPosCode]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(",\n");

/**
 * Whether a payout method is an e-wallet (GCash, Maya): an "THer banks"
 * payout to one of the e-wallet bank codes
 *
 * @param payout - The payout method.
 * @returns true for an e-wallet.
 * @example isEWalletPayout({ payoutType: "OB", bankCode: "0273" }); // true (GCash)
 */
export const isEWalletPayout = (
  payout: Pick<BeneficiaryPayout, "payoutType" | "bankCode">,
): boolean =>
  payout.payoutType === PAYOUT_TYPE.OTHER_BANKS &&
  E_WALLET_BANK_CODES.includes(payout.bankCode);
