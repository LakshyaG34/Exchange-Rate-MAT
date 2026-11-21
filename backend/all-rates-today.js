const axios = require("axios");
const { allRatesTodayApiKey } = require("./config.js");

const API_URL = "https://allratestoday.com/api/v1/rates";
const CACHE_TTL_MS = 60_000;
const latestRatesCache = new Map();

async function fetchAllRatesTodayLatestRates({
  apiKey = allRatesTodayApiKey,
  baseCurrency = "USD",
} = {}) {
  if (!apiKey) {
    throw new Error("Missing API key. Set ALL_RATES_TODAY_API_KEY in your environment.");
  }

  const base = String(baseCurrency).trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(base)) {
    throw new Error("Base currency must be a 3-letter code.");
  }

  const cached = latestRatesCache.get(base);
  if (cached && Date.now() - cached.cachedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const response = await axios.get(API_URL, {
    params: { source: base },
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    timeout: 15000,
  });

  if (!Array.isArray(response.data)) {
    throw new Error("AllRatesToday returned an unexpected rates response.");
  }

  const conversionRates = { [base]: 1 };
  let latestTimestamp = "";

  for (const row of response.data) {
    if (!row || typeof row.target !== "string" || !/^[A-Z]{3}$/i.test(row.target)) {
      continue;
    }

    const rate = Number(row.rate);
    if (!Number.isFinite(rate) || rate <= 0) continue;

    conversionRates[row.target.toUpperCase()] = rate;
    if (typeof row.time === "string" && row.time > latestTimestamp) {
      latestTimestamp = row.time;
    }
  }

  if (Object.keys(conversionRates).length === 1) {
    throw new Error("AllRatesToday did not return any exchange rates.");
  }

  const data = {
    base_code: base,
    time_last_update_utc: latestTimestamp,
    conversion_rates: conversionRates,
  };
  latestRatesCache.set(base, { data, cachedAt: Date.now() });
  return data;
}

module.exports = { fetchAllRatesTodayLatestRates };
