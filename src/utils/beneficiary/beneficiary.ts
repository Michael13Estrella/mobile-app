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
  MY_ACCOUNT_FLAG,
  RELATIONSHIP_SELF_CODE,
} from "../../constants/beneficiary";
import { BeneficiaryCommonValues } from "../../schemas/beneficiary/beneficiaryCommonSchema";
import { CorporateFormValues } from "../../schemas/beneficiary/corporateBeneficiarySchema";
import { IndividualFormValues } from "../../schemas/beneficiary/individualBeneficiarySchema";
import {
  BeneficiaryCategory,
  BeneficiaryDetail,
  BeneficiarySummary,
  CreateBeneficiaryDetails,
  CreateCorporateBeneficiary,
  CreateIndividualBeneficiary,
  Remitter,
} from "../../types";
import { formatPersonName } from "../format/formatName";
import { optionalField } from "../api/requestFields";
import { GENDER_VALUES } from "../../constants/userFields";

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
 * How to call a beneficiary in a sentence: the nickname, otherwise the
 * company name, otherwise the first name.
 *
 * @param beneficiary - The name fields
 * @returns The short name
 * @example getBeneficiaryShortName({ beneAlias: "", companyName: "", firstName: "JOSH" }); // "Josh"
 */
export const getBeneficiaryShortName = (
  beneficiary: Pick<
    BeneficiaryDetail,
    "beneAlias" | "companyName" | "firstName"
  >,
): string =>
  beneficiary.beneAlias.trim() ||
  beneficiary.companyName.trim() ||
  formatPersonName(beneficiary.firstName);

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

// The shared fields (address, relationship, mobile) of both forms, as the
// API names them
const toCreateBeneficiaryCommon = (values: BeneficiaryCommonValues) => ({
  address1: values.addressLine1.trim(),
  address2: optionalField(values.addressLine2),
  cityProvCode: values.cityProvCode,
  zipPosCode: values.zipPosCode,
  relationToBeneCode: values.relationToBeneCode,
  // Only filled with "Others" (the form clears it otherwise)
  relationToBeneOthers: optionalField(values.relationToBeneOthers),
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

/**
 * Which kind of beneficiary a new one is (for its "Type" and the drawer
 * texts): corporate, the remitter's own account, or an individual.
 *
 * @param details - The new beneficiary
 * @returns Its category
 * @example getBeneficiaryCategory({ beneficiaryType: "I", myAccountFlg: 1 }); // "ownAccount"
 */
export const getBeneficiaryCategory = (
  details: Pick<CreateBeneficiaryDetails, "beneficiaryType" | "myAccountFlg">,
): BeneficiaryCategory => {
  if (details.beneficiaryType === BENEFICIARY_TYPE.CORPORATE) {
    return "corporate";
  }
  return details.myAccountFlg === MY_ACCOUNT_FLAG.YES
    ? "ownAccount"
    : "individual";
};

/**
 * The name to show for a new beneficiary: the company name, or the person's
 * first, middle and last name (formatted).
 *
 * @param details - The new beneficiary
 * @returns The display name
 * @example getNewBeneficiaryName(individual); // "Josh Cullen Santos"
 */
export const getNewBeneficiaryName = (
  details: CreateBeneficiaryDetails,
): string =>
  details.beneficiaryType === BENEFICIARY_TYPE.CORPORATE
    ? details.companyName
    : getBeneficiaryFullName({
        firstName: details.firstName,
        middleName: details.middleName ?? "",
        lastName: details.lastName,
        companyName: "",
      });

/**
 * The individual form's starting values for the remitter's own account:
 * their name, gender and birth date from their profile, and "Self".
 *
 * @param profile - The signed-in remitter's profile
 * @returns The values to prefill (the rest of the form stays empty)
 * @example toOwnAccountFormValues(profile).relationToBeneCode; // RELATIONSHIP_SELF_CODE
 */
export const toOwnAccountFormValues = (
  profile: Pick<
    Remitter,
    "firstName" | "middleName" | "lastName" | "gender" | "birthDate"
  >,
): Partial<IndividualFormValues> => ({
  firstName: profile.firstName,
  middleName: profile.middleName,
  lastName: profile.lastName,
  // Only a value the form's gender choice knows
  gender: GENDER_VALUES.find((value) => value === profile.gender) ?? "",
  // The date part only, if the profile sends a date-time
  birthDate: profile.birthDate.split("T").at(0) ?? "",
  relationToBeneCode: RELATIONSHIP_SELF_CODE,
});
