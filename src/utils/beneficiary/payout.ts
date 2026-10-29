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
  E_WALLET_CURRENCY,
  METROBANK_ACCOUNT_NO_TEMPLATE,
  METROBANK_BANK_CODE,
  METROBANK_BANK_NAME,
  PAYOUT_TYPE,
} from "../../constants/payout";
import { MetrobankAccountFormValues } from "../../schemas/payout/metrobankAccountSchema";
import { OtherBankAccountFormValues } from "../../schemas/payout/otherBankAccountSchema";
import {
  BeneficiaryPayout,
  CreatePayoutMetrobankAccount,
  CreatePayoutCashPickup,
  CreatePayoutOtherBanks,
  PayoutSummary,
} from "../../types";
import { optionalField } from "../api/requestFields";
import { fillDigitsTemplate, toDomesticPhoneNumber } from "../format/phone";

/**
 * Whether a bank code is an e-wallet's (GCash, Maya).
 *
 * @param bankCode - The bank code
 * @returns true for an e-wallet
 * @example isEWalletBankCode("0273"); // true (GCash)
 */
export const isEWalletBankCode = (bankCode: string): boolean =>
  E_WALLET_BANK_CODES.includes(bankCode);

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
): CreatePayoutMetrobankAccount => ({
  payoutType: PAYOUT_TYPE.METROBANK_ACCOUNT,
  currency: values.currency,
  caBankNameCode: METROBANK_BANK_CODE,
  caAccountNo: values.accountNo,
  caBranchName: optionalField(values.branchName),
});

export const toCreateOtherBankPayout = (
  values: OtherBankAccountFormValues,
): CreatePayoutOtherBanks => {
  const isEWallet = isEWalletBankCode(values.bankCode);

  return {
    payoutType: PAYOUT_TYPE.OTHER_BANKS,
    currency: isEWallet ? E_WALLET_CURRENCY : values.currency,
    obBankNameCode: values.bankCode,
    obAccountNo: isEWallet
      ? toDomesticPhoneNumber(values.accountNo)
      : values.accountNo,
    obBranchName: isEWallet ? undefined : values.branchName.trim(),
  };
};

/**
 * The payout part of the create request for a cash pick-up: only its type
 * (the beneficiary picks up the cash at any payout partner).
 *
 * @returns The cash pick-up payout, as the API expects it
 * @example toCreateCashPickupPayout().payoutType; // "CP"
 */
export const toCreateCashPickupPayout = (): CreatePayoutCashPickup => ({
  payoutType: PAYOUT_TYPE.CASH_PICKUP,
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
 * A payout method in one line, for texts about it (e.g. a delete
 * confirmation): its bank and the last digits of the account number.
 *
 * @param payout - A saved or new payout
 * @returns e.g. "Metrobank •••• 1537"; only the name when it has no
 *    account number (cash pick-up)
 * @example getPayoutLabel({ bankName: "Metrobank", accountNo: "3456789121537", … }); // "Metrobank •••• 1537"
 */
export const getPayoutLabel = (
  payout: Pick<PayoutSummary, "bankName" | "accountNo">,
): string =>
  [payout.bankName, payout.accountNo && maskAccountNumber(payout.accountNo)]
    .filter(Boolean)
    .join(" ");

/**
 * What a payout row shows for a new Metrobank account payout.
 *
 * @param payout - The Metrobank account payout from the draft
 * @returns The row's bank, account number and currency
 * @example toMetrobankPayoutSummary(payout).bankName; // "Metrobank"
 */
export const toMetrobankPayoutSummary = (
  payout: CreatePayoutMetrobankAccount,
): PayoutSummary => ({
  payoutType: payout.payoutType,
  bankCode: METROBANK_BANK_CODE,
  bankName: METROBANK_BANK_NAME,
  accountNo: payout.caAccountNo,
  currency: payout.currency,
});

/**
 * What a payout row shows for a new other bank / e-wallet payout.
 *
 * @param payout - The other bank payout from the draft
 * @param bankName - The picked bank's name (the request has only its code)
 * @returns The row's bank, account number and currency
 * @example toOtherBankPayoutSummary(payout, "GCash").bankName; // "GCash"
 */
export const toOtherBankPayoutSummary = (
  payout: CreatePayoutOtherBanks,
  bankName: string,
): PayoutSummary => ({
  payoutType: payout.payoutType,
  bankCode: payout.obBankNameCode,
  bankName,
  accountNo: payout.obAccountNo,
  currency: payout.currency,
});

/**
 * What a payout row shows for a new cash pick-up: only its name (it has no
 * bank, account number or currency).
 *
 * @param label - The translated "Cash pick-up"
 * @returns The row's name, with the other fields empty
 * @example toCashPickupPayoutSummary(t("addPayoutMethod.options.cashPickup.title")).bankName; // "Cash pick-up"
 */
export const toCashPickupPayoutSummary = (label: string): PayoutSummary => ({
  payoutType: PAYOUT_TYPE.CASH_PICKUP,
  bankCode: "",
  bankName: label,
  accountNo: "",
  currency: "",
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
