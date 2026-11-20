const fs = require("node:fs");
const path = require("node:path");

const envFile = path.join(__dirname, ".env");
if (typeof process.loadEnvFile === "function" && fs.existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const configuredPort = process.env.PORT ? Number(process.env.PORT) : 4000;
if (!Number.isInteger(configuredPort) || configuredPort < 1 || configuredPort > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

module.exports = Object.freeze({
  port: configuredPort,
  exchangeRateApiKey: process.env.EXCHANGE_RATE_API_KEY?.trim() || "",
});
