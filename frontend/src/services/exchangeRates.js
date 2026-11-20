import { getJson } from "./apiClient.js";

export function getLatestExchangeRates(baseCurrency) {
  return getJson(`/api/exchange-rate/latest?base=${encodeURIComponent(baseCurrency)}`);
}
