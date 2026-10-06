import { useCallback, useEffect, useRef, useState } from "react";
import { ExchangeRate } from "../types/exchangeRate.types";
import { exchangeRateService } from "../services/exchangeRate/exchangeRateService";
import { useFocusEffect } from "expo-router";
import { AppState } from "react-native";

// How often the visible card re-checks the (server-cached) rates.
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

// Indicative rates for the rate cards. Refreshed whenever the screen gains focus,
// the app returns to the foreground, and periodically while visible, so a
// changed rate shows up without the user doing anything
export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  // Only the newest request may update the card (avoids out-of-order results).
  const latestRequestId = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    try {
      const result = await exchangeRateService.fetchCachedRates();
      if (requestId !== latestRequestId.current) return;
      setRates(result);
      setHasError(result.length === 0);
    } catch {
      if (requestId !== latestRequestId.current) return;
      // Show "unavailable" rather than a rate that may be outdated.
      setRates([]);
      setHasError(true);
    } finally {
      if (requestId === latestRequestId.current) setIsLoading(false);
    }
  }, []);

  // On screen focus, then periodically while the screen stays visible
  useFocusEffect(
    useCallback(() => {
      void refresh(); // load as soon as the screen is shown
      const interval = setInterval(refresh, REFRESH_INTERVAL_MS);
      return () => clearInterval(interval);
    }, [refresh]),
  );

  // When the app comes back from the background
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") void refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  return { rates, isLoading, hasError, refresh };
}
