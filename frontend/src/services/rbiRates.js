import { getJson } from "./apiClient.js";

export function getRbiRates(range) {
  return getJson(`/api/rbi/rates?${new URLSearchParams(range)}`);
}
