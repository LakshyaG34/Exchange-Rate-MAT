const express = require("express");
const { fetchLatestExchangeRates } = require("../exchange-rate.js");

const router = express.Router();

router.get("/latest", async (request, response) => {
  const baseCurrency = String(request.query.base || "USD").toUpperCase();
  if (!/^[A-Z]{3}$/.test(baseCurrency)) {
    return response.status(400).json({ error: "Base currency must be a 3-letter code." });
  }

  try {
    const data = await fetchLatestExchangeRates({ baseCurrency });
    response.set("Cache-Control", "no-store");
    return response.json({
      source: "ExchangeRate-API",
      base_code: data.base_code,
      time_last_update_utc: data.time_last_update_utc,
      time_next_update_utc: data.time_next_update_utc,
      conversion_rates: data.conversion_rates,
    });
  } catch (error) {
    const missingKey = error.message.includes("Missing API key");
    const message = error.response?.data?.["error-type"] || error.message;
    return response.status(missingKey ? 500 : 502).json({ error: message });
  }
});

module.exports = router;
