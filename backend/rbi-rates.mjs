import axios from "axios";
import * as cheerio from "cheerio";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

const RBI_URL = "https://m.rbi.org.in/scripts/ReferenceRateArchive.aspx";

export const RBI_CURRENCIES = [
  { code: "USD", label: "USD (INR / 1 USD)", units: 1 },
  { code: "GBP", label: "GBP (INR / 1 GBP)", units: 1 },
  { code: "EUR", label: "EUR (INR / 1 EUR)", units: 1 },
  { code: "JPY", label: "JPY (INR / 100 JPY)", units: 100 },
  { code: "AED", label: "AED (INR / 1 AED)", units: 1 },
  { code: "IDR", label: "IDR (INR / 10,000 IDR)", units: 10000 },
  { code: "RUB", label: "RUB (INR / 1 RUB)", units: 1 },
];

function toIsoDate(rbiDate) {
  const [day, month, year] = rbiDate.split("/");
  return `${year}-${month}-${day}`;
}

export async function fetchRBIRates(fromDate, toDate) {
  const jar = new CookieJar();
  const client = wrapper(
    axios.create({
      jar,
      withCredentials: true,
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "text/html,application/xhtml+xml",
      },
    })
  );

  // RBI's ASP.NET form needs fresh hidden state and a session cookie per request.
  const initial = await client.get(RBI_URL);
  const $ = cheerio.load(initial.data);
  const form = new URLSearchParams();

  $("form input[name]").each((_, element) => {
    const input = $(element);
    const name = input.attr("name");
    const type = (input.attr("type") || "").toLowerCase();

    if (["checkbox", "radio"].includes(type) && !input.is(":checked")) return;
    if (["submit", "button", "image", "file"].includes(type)) return;

    form.set(name, input.val() ?? "");
  });

  form.set("__EVENTTARGET", "");
  form.set("__EVENTARGUMENT", "");
  form.set("txtFromDate", fromDate);
  form.set("txtToDate", toDate);
  form.set("chkAll", "on");
  form.set("btnSubmit", " GO ");

  const response = await client.post(RBI_URL, form.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: RBI_URL,
      Origin: "https://m.rbi.org.in",
    },
  });

  const result = cheerio.load(response.data);
  const table = result("table")
    .filter((_, element) => result(element).text().includes("USD (INR / 1 USD)"))
    .first();

  if (!table.length) {
    throw new Error("RBI exchange-rate table was not found in the response.");
  }

  const rates = [];
  table.find("tr").each((_, row) => {
    const cells = result(row)
      .find("td")
      .map((__, cell) => result(cell).text().trim())
      .get();

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(cells[0] || "")) return;

    rates.push({
      date: toIsoDate(cells[0]),
      values: Object.fromEntries(
        RBI_CURRENCIES.map((currency, index) => [
          currency.code,
          cells[index + 1] ?? null,
        ])
      ),
    });
  });

  return {
    source: "Reserve Bank of India",
    from: fromDate,
    to: toDate,
    currencies: RBI_CURRENCIES,
    rates,
  };
}
