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

import { RECEIVE_CURRENCIES } from "../../../constants/currency";
import { getReceiveCurrencies } from "../receiveCurrencies";

describe("getReceiveCurrencies", () => {
  it("offers every currency when the remitter has both accounts", () => {
    expect(
      getReceiveCurrencies({
        hasMetrobankYenAccount: true,
        hasUsdAccount: true,
      }),
    ).toEqual([...RECEIVE_CURRENCIES]);
  });

  it("offers only PHP without a USD or Metrobank yen account", () => {
    expect(
      getReceiveCurrencies({
        hasMetrobankYenAccount: false,
        hasUsdAccount: false,
      }),
    ).toEqual(["PHP"]);
  });

  it("leaves out USD without a USD account", () => {
    expect(
      getReceiveCurrencies({
        hasMetrobankYenAccount: true,
        hasUsdAccount: false,
      }),
    ).toEqual(["PHP", "JPY"]);
  });

  it("leaves out JPY without a Metrobank yen account", () => {
    expect(
      getReceiveCurrencies({
        hasMetrobankYenAccount: false,
        hasUsdAccount: true,
      }),
    ).toEqual(["PHP", "USD"]);
  });
});
