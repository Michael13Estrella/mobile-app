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

import {
  BENEFICIARY_TYPE,
  E_WALLET_BANK_CODES,
  MY_ACCOUNT_FLAG,
  PAYOUT_TYPE,
} from "../constants/beneficiary";
import { BeneficiaryCommonValues } from "../schemas/beneficiary/beneficiaryCommonSchema";
import { CorporateFormValues } from "../schemas/beneficiary/corporateBeneficiarySchema";
import { IndividualFormValues } from "../schemas/beneficiary/individualBeneficiarySchema";
import {
  BeneficiaryDetail,
  BeneficiaryPayout,
  BeneficiarySummary,
  CreateCorporateBeneficiary,
  CreateIndividualBeneficiary,
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

// An optional field for the request: trimmed, or left out (undefined) when
// empty, since the API takes missing fields
const optionalField = (value: string): string | undefined =>
  value.trim() || undefined;

// The shared fields (address, relationship, mobile) of both forms, as the
// API names them
const toCreateBeneficiaryCommon = (values: BeneficiaryCommonValues) => ({
  address1: values.addressLine1.trim(),
  address2: optionalField(values.addressLine2),
  cityProvCode: values.cityProvCode,
  zipPosCode: values.zipPosCode,
  relationToBeneCode: values.relationToBeneCode,
  mobileNo: optionalField(values.mobileNo),
});

/**
 * The beneficiary part of the create request, from the individual form.
 * Optional fields left empty are left out.
 *
 * @param values - The individual form's values
 * @param isOwnAccount - Whether it's the remitter's own account
 * @returns The individual beneficiary as the API expects it
 * @example toCreateIndividualBeneficiary(values, false).beneficiaryType; // "I"
 */
export const toCreateIndividualBeneficiary = (
  values: IndividualFormValues,
  isOwnAccount: boolean,
): CreateIndividualBeneficiary => ({
  beneficiaryType: BENEFICIARY_TYPE.INDIVIDUAL,
  myAccountFlg: isOwnAccount ? MY_ACCOUNT_FLAG.YES : MY_ACCOUNT_FLAG.NO,
  beneAlias: optionalField(values.beneAlias),
  lastName: values.lastName.trim(),
  firstName: values.firstName.trim(),
  middleName: optionalField(values.middleName),
  gender: values.gender || undefined,
  birthOrEstablishDate: optionalField(values.birthDate),
  ...toCreateBeneficiaryCommon(values),
});

/**
 * The beneficiary part of the create request, from the corporate form.
 * Optional fields left empty are left out.
 *
 * @param values - The corporate form's values
 * @returns The corporate beneficiary as the API expects it
 * @example toCreateCorporateBeneficiary(values).beneficiaryType; // "C"
 */
export const toCreateCorporateBeneficiary = (
  values: CorporateFormValues,
): CreateCorporateBeneficiary => ({
  beneficiaryType: BENEFICIARY_TYPE.CORPORATE,
  myAccountFlg: MY_ACCOUNT_FLAG.NO,
  companyName: values.companyName.trim(),
  officeTelNo: values.officeTelNo,
  ...toCreateBeneficiaryCommon(values),
});
