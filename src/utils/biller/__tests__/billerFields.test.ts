/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-16
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { Biller } from "../../../types";
import { getBillerFields } from "../billerFields";

const CARD_BILLER_CODE = "CARD";

// The real list is still empty: test with a known card biller
jest.mock("../../../constants/biller", () => ({
  ...jest.requireActual("../../../constants/biller"),
  CREDIT_CARD_BILLER_CODES: ["CARD"],
}));

const makeBiller = (overrides: Partial<Biller> = {}): Biller => ({
  utilityCode: "BILLER",
  utilityDesc: "HOME CABLE",
  shortCode: "",
  acctNo: "",
  acctCurrency: "",
  subscriberNameFlg: false,
  subscriberNoFlg: false,
  docRefNoFlg: false,
  telNoFlg: false,
  acctType: "",
  tranType: "",
  mosaicOutputFlg: false,
  branchCode: "",
  ...overrides,
});

describe("getBillerFields", () => {
  it("asks for nothing before a biller is picked", () => {
    expect(getBillerFields(undefined)).toEqual({
      isCreditCard: false,
      subscriberNo: false,
      docRefNo: false,
      telNo: false,
    });
  });

  it("follows the biller's flags", () => {
    expect(
      getBillerFields(
        makeBiller({
          subscriberNoFlg: true,
          docRefNoFlg: true,
          telNoFlg: true,
        }),
      ),
    ).toEqual({
      subscriberNo: true,
      isCreditCard: false,
      docRefNo: true,
      telNo: true,
    });
  });

  it("treats a card biller's subscriber number as a credit card number", () => {
    const fields = getBillerFields(
      makeBiller({ utilityCode: CARD_BILLER_CODE, subscriberNoFlg: true }),
    );
    expect(fields.isCreditCard).toBe(true);
  });

  it("isn't a credit card when the card biller doesn't ask for the number", () => {
    const fields = getBillerFields(
      makeBiller({ utilityCode: CARD_BILLER_CODE }),
    );
    expect(fields.isCreditCard).toBe(false);
  });
});
