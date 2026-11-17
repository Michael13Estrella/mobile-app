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

import {
  BILLER_ADDRESS,
  BILLER_AREA_CODE,
  BILLER_RELATIONSHIP,
  CREDIT_CARD_BILLER_CODES,
} from "../../../constants/biller";
import {
  BENEFICIARY_TYPE,
  MY_ACCOUNT_FLAG,
  RELATIONSHIP_OTHERS_CODE,
} from "../../../constants/beneficiary";
import { PAYOUT_TYPE } from "../../../constants/payout";
import {
  AddBillerFormValues,
  EMPTY_ADD_BILLER_FORM,
} from "../../../schemas/biller/addBillerSchema";
import { Biller } from "../../../types";
import { buildAddBillerRequest } from "../billerRequest";

const makeBiller = (overrides: Partial<Biller> = {}): Biller => ({
  utilityCode: "797",
  utilityDesc: "HORIZON LAND",
  shortCode: "",
  acctNo: "",
  acctCurrency: "PHP",
  subscriberNameFlg: false,
  subscriberNoFlg: true,
  docRefNoFlg: true,
  telNoFlg: true,
  acctType: "",
  tranType: "",
  mosaicOutputFlg: false,
  branchCode: "",
  ...overrides,
});

const makeValues = (
  overrides: Partial<AddBillerFormValues> = {},
): AddBillerFormValues => ({
  ...EMPTY_ADD_BILLER_FORM,
  utilityCode: "797",
  subscriberNo: " 2201 7781 ",
  docRefNo: "H-55102",
  telCountry: "JP",
  telNo: "9012345678",
  ...overrides,
});

describe("buildAddBillerRequest", () => {
  it("saves the biller as a beneficiary with the agreed fixed values", () => {
    const { beneficiary } = buildAddBillerRequest(makeValues(), makeBiller());

    expect(beneficiary).toEqual({
      beneficiaryType: BENEFICIARY_TYPE.BILLER,
      companyName: "HORIZON LAND",
      officeTelNo: "",
      relationToBeneCode: RELATIONSHIP_OTHERS_CODE,
      relationToBeneOthers: BILLER_RELATIONSHIP,
      address1: BILLER_ADDRESS,
      cityProvCode: BILLER_AREA_CODE,
      zipPosCode: BILLER_AREA_CODE,
      myAccountFlg: MY_ACCOUNT_FLAG.NO,
    });
    // A date: left out (null), not ""
    expect(beneficiary).not.toHaveProperty("birthOrEstablishDate");
  });

  it("sends the typed fields, the biller's currency and name", () => {
    const { payout } = buildAddBillerRequest(makeValues(), makeBiller());

    expect(payout).toEqual({
      payoutType: PAYOUT_TYPE.BILLS_PAYMENT,
      currency: "PHP",
      bpUtilityCode: "797",
      bpSubscriberName: "HORIZON LAND",
      bpSubscriberNo: "2201 7781",
      bpDocuRefNo: "H-55102",
      bpTelNo: "819012345678",
    });
  });

  it("sends a Philippine number with its country code", () => {
    const { payout } = buildAddBillerRequest(
      makeValues({ telCountry: "PH", telNo: "9171234567" }),
      makeBiller(),
    );
    expect(payout.bpTelNo).toBe("639171234567");
  });

  it('sends "" for the fields the biller doesn\'t ask for', () => {
    const { payout } = buildAddBillerRequest(
      makeValues(),
      makeBiller({ docRefNoFlg: false, telNoFlg: false }),
    );
    expect(payout.bpDocuRefNo).toBe("");
    expect(payout.bpTelNo).toBe("");
  });

  it("sends a card biller's card number", () => {
    const { payout } = buildAddBillerRequest(
      makeValues({ subscriberNo: "5412750012344821" }),
      makeBiller({
        utilityCode: CREDIT_CARD_BILLER_CODES[0],
        docRefNoFlg: false,
        telNoFlg: false,
      }),
    );
    expect(payout.bpSubscriberNo).toBe("5412750012344821");
  });
});
