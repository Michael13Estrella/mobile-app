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

import { ENDPOINTS } from "../../constants/endpoints";
import {
  ExchangeRate,
  ExchangeRateResult,
} from "../../types/exchangeRate.types";
import { apiClient } from "../api/apiClient";

// "JPY/PHP" -> JPY to PHP
const toExchangeRate = (item: ExchangeRateResult): ExchangeRate => {
  const [fromCurrency = "", toCurrency = ""] = item.exchangeTypeDesc.split("/");
  return {
    exchangeType: item.exchangeType,
    fromCurrency,
    toCurrency,
    rate: item.sellingRate,
    rateDate: item.targetDate,
  };
};

const fetchRates = async (path: string): Promise<ExchangeRate[]> => {
  const { ok, data } = await apiClient.plain.get<ExchangeRateResult[]>(path);
  return ok && data ? data.map(toExchangeRate) : [];
};

export const exchangeRateService = {
  // Indicative rates from the shared server cache, for display only
  fetchCachedRates: () => fetchRates(ENDPOINTS.EXCHANGE_RATES_CACHED),

  // Real-time rates for send money. Fetch every time they're needed
  // don't keep them in app state.
  fetchLiveRates: () => fetchRates(ENDPOINTS.EXCHANGE_RATES_LIVE),
};
