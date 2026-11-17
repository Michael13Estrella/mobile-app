/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-11-17
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

import { CREDIT_CARD_BILLER_CODES } from "../../../constants/biller";
import {
  getEnrolledBillerNumber,
  matchesEnrolledBillerSearch,
} from "../enrolledBillers";

describe("getEnrolledBillerNumber", () => {
  it("shows a subscriber number as saved", () => {
    expect(
      getEnrolledBillerNumber({
        bpUtilityCode: "797",
        bpSubscriberNo: "1002 3345",
      }),
    ).toBe("1002 3345");
  });

  it("shows only a card number's last digits", () => {
    expect(
      getEnrolledBillerNumber({
        bpUtilityCode: CREDIT_CARD_BILLER_CODES[0],
        bpSubscriberNo: "5412750012344821",
      }),
    ).toBe("•••• 4821");
  });
});

describe("matchesEnrolledBillerSearch", () => {
  const biller = { bpSubscriberName: "HOME CABLE", beneAlias: "Condo" };

  it("matches everything when the search is empty", () => {
    expect(matchesEnrolledBillerSearch(biller, "  ")).toBe(true);
  });

  it("matches the name or alias, ignoring case", () => {
    expect(matchesEnrolledBillerSearch(biller, "cable")).toBe(true);
    expect(matchesEnrolledBillerSearch(biller, "CONDO")).toBe(true);
  });

  it("doesn't match other text", () => {
    expect(matchesEnrolledBillerSearch(biller, "metrobank")).toBe(false);
  });
});
