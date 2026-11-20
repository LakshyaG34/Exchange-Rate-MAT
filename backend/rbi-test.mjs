import { fetchRBIRates } from "./rbi-rates.mjs";

const fromDate = process.argv[2] ?? "18/11/2026";
const toDate = process.argv[3] ?? "19/11/2026";

try {
  const result = await fetchRBIRates(fromDate, toDate);
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
