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

import { RECEIVE_CURRENCIES, ReceiveCurrency } from "../../constants/currency";
import { DashboardStatsResponse } from "../../types";

type ReceiveCurrencyFlags = Pick<
  DashboardStatsResponse,
  "hasMetrobankYenAccount" | "hasUsdAccount"
>;

// Currencies the remitter can receive in, in the order of RECEIVE_CURRENCIES.
// PHP is always offered; USD and JPY only with a matching account
export function getReceiveCurrencies({
  hasMetrobankYenAccount,
  hasUsdAccount,
}: ReceiveCurrencyFlags): ReceiveCurrency[] {
  // A Record over ReceiveCurrency: adding a currency won't compile until it's handled here
  const isOffered: Readonly<Record<ReceiveCurrency, boolean>> = {
    PHP: true,
    USD: hasUsdAccount,
    JPY: hasMetrobankYenAccount,
  };

  return RECEIVE_CURRENCIES.filter((code) => isOffered[code]);
}
