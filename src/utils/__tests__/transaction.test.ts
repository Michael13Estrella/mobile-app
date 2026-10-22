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

import {
  getTransactionName,
  getTransactionTitle,
  isMoneyIn,
} from "../transaction";
import { TRANS_POST_TYPE } from "../../constants/transaction";
import { RecentTransaction } from "../../types";
import { PAYOUT_TYPE } from "../../constants/beneficiary";

const transaction = (
  fields: Partial<RecentTransaction> = {},
): RecentTransaction => ({
  id: 1,
  transDate: "2026-02-23T07:32:00+09:00",
  transRef: "REF-1",
  runningBalance: 100_000,
  sourceAmount: 12_000,
  destCurrency: "PHP",
  destAmount: 4_746,
  beneFirstName: "MAX",
  beneMiddleName: "",
  beneLastName: "MAYFIELD",
  beneAlias: "",
  beneCompanyName: "",
  beneficiaryType: "I",
  payoutType: PAYOUT_TYPE.OTHER_BANKS,
  transPostType: TRANS_POST_TYPE.DEBIT,
  ...fields,
});

describe("getTransactionName", () => {
  it("uses the alias first", () => {
    expect(getTransactionName(transaction({ beneAlias: "Juan Savings" }))).toBe(
      "Juan Savings",
    );
  });

  it("uses the company or biller name as sent", () => {
    expect(
      getTransactionName(transaction({ beneCompanyName: "MERALCO" })),
    ).toBe("MERALCO");
  });

  it("uses the formatted first and last name otherwise", () => {
    expect(getTransactionName(transaction())).toBe("Mayfield Max");
  });
});

describe("getTransactionTitle", () => {
  it("is Send Money for remittances", () => {
    expect(getTransactionTitle(transaction())).toEqual({
      key: "home.transactions.sendMoneyTo",
      name: "Mayfield Max",
    });
  });

  it("is Bills Payment for bill payments", () => {
    expect(
      getTransactionTitle(
        transaction({
          payoutType: PAYOUT_TYPE.BILLS_PAYMENT,
          beneCompanyName: "MERALCO",
        }),
      ),
    ).toEqual({ key: "home.transactions.billsPayment", name: "MERALCO" });
  });

  it("is Add to Wallet for credits, without a name", () => {
    expect(
      getTransactionTitle(
        transaction({ transPostType: TRANS_POST_TYPE.CREDIT }),
      ),
    ).toEqual({ key: "home.transactions.addToWallet" });
  });

  it("is Refund for refunds, even of a bill payment", () => {
    expect(
      getTransactionTitle(
        transaction({
          transPostType: TRANS_POST_TYPE.REFUND,
          payoutType: PAYOUT_TYPE.BILLS_PAYMENT,
          beneCompanyName: "MERALCO",
        }),
      ),
    ).toEqual({ key: "home.transactions.refund", name: "MERALCO" });
  });
});

describe("isMoneyIn", () => {
  it("is false for debits, true for credits and refunds", () => {
    expect(isMoneyIn(transaction())).toBe(false);
    expect(
      isMoneyIn(transaction({ transPostType: TRANS_POST_TYPE.CREDIT })),
    ).toBe(true);
    expect(
      isMoneyIn(transaction({ transPostType: TRANS_POST_TYPE.REFUND })),
    ).toBe(true);
  });
});
