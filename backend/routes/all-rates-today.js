const express = require("express");
const { fetchAllRatesTodayLatestRates } = require("../all-rates-today.js");

const router = express.Router();

router.get("/latest", async (request, response) => {
  const baseCurrency = String(request.query.base || "USD").toUpperCase();
  if (!/^[A-Z]{3}$/.test(baseCurrency)) {
    return response.status(400).json({ error: "Base currency must be a 3-letter code." });
  }

  try {
    const data = await fetchAllRatesTodayLatestRates({ baseCurrency });
    response.set("Cache-Control", "private, max-age=30");
    return response.json({ source: "AllRatesToday", ...data });
  } catch (error) {
    const upstreamError = error.response?.data?.error;
    const message = typeof upstreamError === "string" ? upstreamError : error.message;
    const missingKey = message.includes("Missing API key");
    return response.status(missingKey ? 500 : 502).json({
      error: message || "Could not fetch rates from AllRatesToday.",
    });
  }
});

module.exports = router;
