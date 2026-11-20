const command = process.argv[2];

if (command === "test:exchange-rate") {
  const { fetchLatestExchangeRates } = require("./exchange-rate");

  fetchLatestExchangeRates()
    .then((data) => {
      console.log(`API test succeeded for base currency ${data.base_code}.`);
      console.log(`Last updated: ${data.time_last_update_utc}`);
      console.log(`Currencies returned: ${Object.keys(data.conversion_rates).length}`);
    })
    .catch((error) => {
      console.error(error.response?.data?.["error-type"] || error.message);
      process.exitCode = 1;
    });
} else {
  require("./server");
}
