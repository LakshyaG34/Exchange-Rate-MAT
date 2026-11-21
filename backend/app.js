const express = require("express");
const corsMiddleware = require("./middleware/cors.js");
const healthRoutes = require("./routes/health.js");
const exchangeRateRoutes = require("./routes/exchange-rate.js");
const allRatesTodayRoutes = require("./routes/all-rates-today.js");
const rbiRoutes = require("./routes/rbi.js");

const app = express();

app.disable("x-powered-by");
app.use(corsMiddleware);
app.use("/api/health", healthRoutes);
app.use("/api/exchange-rate", exchangeRateRoutes);
app.use("/api/all-rates-today", allRatesTodayRoutes);
app.use("/api/rbi", rbiRoutes);

app.use((request, response) => {
  response.status(404).json({ error: `No API route for ${request.method} ${request.path}` });
});

module.exports = app;
