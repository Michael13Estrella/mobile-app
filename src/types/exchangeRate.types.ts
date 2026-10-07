/*******************************************************************************************
 * System Name    MBJ Mobile App
 * Author Name    Michael ESTRELLA
 * Create Date    2026-10-05
 *
 * Edit History
 * 1.
 * 2.
 * 3.
 ********************************************************************************************/

// GET /api/reference-master/exrates-cache and exrates-non-cache
export interface ExchangeRateResult {
  targetDate: string; // ISO date-time with offset, e.g. "2026-10-05T11:26:57+09:00"
  exchangeType: number;
  exchangeTypeDesc: string;
  sellingRate: number;
}

export interface ExchangeRate {
  exchangeType: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  rateDate: string; // ISO date-time the rate applies from
}
