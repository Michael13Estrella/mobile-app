import { RecentTransaction } from "../types";
import { formatPersonName } from "./formatName";
import { PAYOUT_TYPE, TRANS_POST_TYPE } from "../constants/transaction";

export type TransactionTitle = Readonly<{
  // Translation key of the title
  key: string;
  // The other party, for keys with {{name}}.
  name?: string;
}>;

/**
 * Who the transaction was with: the beneficiary's alias, otherwise the
 * company or biller name (as sent), otherwise last + first name
 *
 * @param transaction - The transaction
 * @returns The display name.
 * @example getTransactionName({ beneFirstName: "MAX", beneLastName: "MAYFIELD", … }); // "Max Mayfield"
 */
export const getTransactionName = (transaction: RecentTransaction): string =>
  formatPersonName(transaction.beneAlias.trim()) ||
  transaction.beneCompanyName.trim() ||
  formatPersonName(`${transaction.beneLastName} ${transaction.beneFirstName}`);

/**
 * The transaction's title as a translation key (+ name): Add to Wallet,
 * Refund, Bills Payment, or Send Money
 *
 * @param transaction - The transaction
 * @returns The key and, where the title names someone, the name
 * @example getTransactionTitle(billPayment); // { key: "home.transactions.billsPayment", name: "MERALCO" }
 */
export const getTransactionTitle = (
  transaction: RecentTransaction,
): TransactionTitle => {
  if (transaction.transPostType === TRANS_POST_TYPE.CREDIT) {
    return { key: "home.transactions.addToWallet" };
  }

  const name = getTransactionName(transaction);
  if (transaction.transPostType === TRANS_POST_TYPE.REFUND) {
    return { key: "home.transactions.refund", name };
  }

  if (transaction.payoutType === PAYOUT_TYPE.BILLS_PAYMENT) {
    return { key: "home.transactions.billsPayment", name };
  }

  return { key: "home.transactions.sendMoneyTo", name };
};

/**
 * Whether the transaction added money to the wallet (credit or refund),
 * shown with "+" instead of "-"
 *
 * @param transaction - The transaction
 * @returns `true` for money in.
 * @example isMoneyIn(topUp); // true
 */
export const isMoneyIn = (transaction: RecentTransaction): boolean =>
  transaction.transPostType !== TRANS_POST_TYPE.DEBIT;
