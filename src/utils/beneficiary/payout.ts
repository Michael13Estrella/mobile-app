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

import {
  E_WALLET_BANK_CODES,
  METROBANK_BANK_CODE,
  PAYOUT_TYPE,
} from "../../constants/payout";
import { MetrobankAccountFormValues } from "../../schemas/payout/metrobankAccountSchema";
import { BeneficiaryPayout, CreateBeneficiaryPayoutCA } from "../../types";
import { optionalField } from "../api/requestFields";

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

/**
 * The payout part of the create request, from the Metrobank account form.
 * The branch is left out when empty.
 *
 * @param values - The Metrobank account form's values
 * @returns The Metrobank account payout, as the API expects it
 * @example toCreateMetrobankPayout({ accountNo: "3456789121537", currency: "PHP", branchName: "" }).caAccountNo; // "3456789121537"
 */
export const toCreateMetrobankPayout = (
  values: MetrobankAccountFormValues,
): CreateBeneficiaryPayoutCA => ({
  payoutType: PAYOUT_TYPE.METROBANK_ACCOUNT,
  currency: values.currency,
  caBankNameCode: METROBANK_BANK_CODE,
  caAccountNo: values.accountNo,
  caBranchName: optionalField(values.branchName),
});
