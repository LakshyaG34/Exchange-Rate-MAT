const express = require("express");
const { isIsoDate, toRbiDate } = require("../utils/dates.js");

const router = express.Router();

router.get("/rates", async (request, response) => {
  const from = String(request.query.from || "");
  const to = String(request.query.to || "");

  if (!isIsoDate(from) || !isIsoDate(to)) {
    return response.status(400).json({
      error: "Provide valid from and to dates in YYYY-MM-DD format.",
    });
  }

  if (from > to) {
    return response.status(400).json({ error: "The from date must be on or before the to date." });
  }

  try {
    const { fetchRBIRates } = await import("../rbi-rates.mjs");
    const data = await fetchRBIRates(toRbiDate(from), toRbiDate(to));
    response.set("Cache-Control", "no-store");
    return response.json({ ...data, from, to });
  } catch (error) {
    return response.status(502).json({
      error: error.message || "Could not fetch rates from RBI.",
    });
  }
});

module.exports = router;
