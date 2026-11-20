const axios = require("axios");
const { exchangeRateApiKey } = require("./config.js");

const API_URL = "https://v6.exchangerate-api.com/v6";

async function fetchLatestExchangeRates({
  apiKey = exchangeRateApiKey,
  baseCurrency = "USD",
} = {}) {
  if (!apiKey) {
    throw new Error(
      "Missing API key. Set EXCHANGE_RATE_API_KEY in your environment."
    );
  }

  const currency = baseCurrency.toUpperCase();
  const url = `${API_URL}/${encodeURIComponent(apiKey)}/latest/${encodeURIComponent(currency)}`;

  const response = await axios.get(url, { timeout: 15000 });
  const data = response.data;

  if (data.result !== "success") {
    throw new Error(
      `ExchangeRate-API returned an error: ${data["error-type"] || "unknown error"}`
    );
  }

  if (!data.conversion_rates || typeof data.conversion_rates !== "object") {
    throw new Error("The API response did not include conversion rates.");
  }

  return data;
}

if (require.main === module) {
  fetchLatestExchangeRates()
    .then((data) => {
      console.log(`API test succeeded for base currency ${data.base_code}.`);
      console.log(`Last updated: ${data.time_last_update_utc}`);
      if (data.conversion_rates.INR !== undefined) {
        console.log(`1 ${data.base_code} = ${data.conversion_rates.INR} INR`);
      }
      console.log(`Currencies returned: ${Object.keys(data.conversion_rates).length}`);
    })
    .catch((error) => {
      const apiMessage = error.response?.data?.["error-type"];
      console.error(apiMessage || error.message);
      process.exitCode = 1;
    });
}

module.exports = {
  fetchLatestExchangeRates,
  testExchangeRateApi: fetchLatestExchangeRates,
};
