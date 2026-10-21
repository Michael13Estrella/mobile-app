/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-20
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// RecentTransaction.transPostType: which way the money went.
export const TRANS_POST_TYPE = {
  // Money out (e.g. a remittance)
  DEBIT: 0,
  // Money in (e.g. Add to Wallet)
  CREDIT: 1,
  // Money back (e.g. reversed remittance to a closed account)
  REFUND: 2,
} as const;

// RecentTransaction.payoutType: how the beneficiary receives it.
export const PAYOUT_TYPE = {
  METROBANK_ACCOUNT: "CA",
  CASH_PICKUP: "CP",
  OTHER_BANKS: "OB",
  BILLS_PAYMENT: "BP",
} as const;
