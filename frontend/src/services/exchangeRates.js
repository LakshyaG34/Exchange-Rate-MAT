import { getJson } from "./apiClient.js";

export function getLatestExchangeRates(baseCurrency) {
  return getJson(`/api/exchange-rate/latest?base=${encodeURIComponent(baseCurrency)}`);
}

export function getAllRatesTodayRates(baseCurrency) {
  return getJson(`/api/all-rates-today/latest?base=${encodeURIComponent(baseCurrency)}`);
}
