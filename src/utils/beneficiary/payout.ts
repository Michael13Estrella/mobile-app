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
  ACCOUNT_NO_MASK,
  ACCOUNT_NO_VISIBLE_DIGITS,
  E_WALLET_BANK_CODES,
  METROBANK_ACCOUNT_NO_TEMPLATE,
  METROBANK_BANK_CODE,
  METROBANK_BANK_NAME,
  PAYOUT_TYPE,
} from "../../constants/payout";
import { MetrobankAccountFormValues } from "../../schemas/payout/metrobankAccountSchema";
import {
  BeneficiaryPayout,
  CreateBeneficiaryPayoutCA,
  PayoutSummary,
} from "../../types";
import { optionalField } from "../api/requestFields";
import { fillDigitsTemplate } from "../format/phone";

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

/**
 * An account number with only its last digits shown, for summaries.
 *
 * @param accountNo - The account number (digits only)
 * @returns "•••• " and the last 4 digits, or the number itself when it's
 *    too short to mask
 * @example maskAccountNumber("3456789121537"); // "•••• 1537"
 */
export const maskAccountNumber = (accountNo: string): string =>
  accountNo.length > ACCOUNT_NO_VISIBLE_DIGITS
    ? `${ACCOUNT_NO_MASK} ${accountNo.slice(-ACCOUNT_NO_VISIBLE_DIGITS)}`
    : accountNo;

/**
 * What a payout row shows for a new Metrobank account payout.
 *
 * @param payout - The Metrobank account payout from the draft
 * @returns The row's bank, account number and currency
 * @example toMetrobankPayoutSummary(payout).bankName; // "Metrobank"
 */
export const toMetrobankPayoutSummary = (
  payout: CreateBeneficiaryPayoutCA,
): PayoutSummary => ({
  payoutType: payout.payoutType,
  bankCode: METROBANK_BANK_CODE,
  bankName: METROBANK_BANK_NAME,
  accountNo: payout.caAccountNo,
  currency: payout.currency,
});

/**
 * A Metrobank account number in its groups, for display.
 *
 * @param accountNo - The 13 digits
 * @returns The grouped number
 * @example formatMetrobankAccountNo("3456789121537"); // "345 678 912 1537"
 */
export const formatMetrobankAccountNo = (accountNo: string): string =>
  fillDigitsTemplate(METROBANK_ACCOUNT_NO_TEMPLATE, accountNo);
