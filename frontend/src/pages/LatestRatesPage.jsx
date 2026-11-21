import { useEffect, useMemo, useState } from "react";
import ConversionCard from "../components/latest/ConversionCard.jsx";
import CurrencyRatesTable from "../components/latest/CurrencyRatesTable.jsx";
import LatestMetrics from "../components/latest/LatestMetrics.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import MethodStrip from "../components/MethodStrip.jsx";
import Notice from "../components/Notice.jsx";
import PageHeading from "../components/PageHeading.jsx";
import { getAllRatesTodayRates, getLatestExchangeRates } from "../services/exchangeRates.js";
import { BASE_CURRENCIES, currencyName } from "../utils/currency.js";

const PROVIDERS = {
  exchangeRate: {
    fetchRates: getLatestExchangeRates,
    tone: "teal",
    eyebrow: "SOURCE 02 · LATEST CONVERSION DATA",
    title: "Latest exchange rates",
    description: "Latest-rate response from ExchangeRate-API, with a selectable base currency.",
    source: "ExchangeRate-API",
    sourceMark: "↗",
    methodTitle: "JSON API request",
    methodDescription: "Frontend calls Express; the API key stays on the backend while it requests the latest JSON rates.",
    methodMeta: "Latest snapshot",
    updatedLabel: "LAST UPDATED",
    updatedCaption: "Source update timestamp",
    tableFootnote: null,
  },
  allRatesToday: {
    fetchRates: getAllRatesTodayRates,
    tone: "indigo",
    eyebrow: "SOURCE 03 · LIVE MID-MARKET DATA",
    title: "AllRatesToday exchange rates",
    description: "Live mid-market quotes from AllRatesToday, with a selectable base currency.",
    source: "AllRatesToday",
    sourceMark: "A",
    methodTitle: "Authenticated rates API",
    methodDescription: "Express sends a backend-only bearer key to AllRatesToday and reshapes the returned quotes for the conversion tools.",
    methodMeta: "Live mid-market",
    updatedLabel: "NEWEST QUOTE",
    updatedCaption: "Newest quote timestamp in this response",
    tableFootnote: "Mid-market rates; the timestamp shows the newest quote returned.",
  },
};

function LatestRatesPage({ provider = "exchangeRate" }) {
  const source = PROVIDERS[provider] || PROVIDERS.exchangeRate;
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState("1");
  const [targetCurrency, setTargetCurrency] = useState("INR");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setData(null);

    source.fetchRates(baseCurrency)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message);
          setData(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [baseCurrency, source]);

  const rates = data?.conversion_rates || {};
  const currencyCodes = useMemo(() => Object.keys(rates).sort(), [rates]);
  const visibleCurrencies = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return currencyCodes;
    return currencyCodes.filter((code) =>
      code.toLowerCase().includes(term) || currencyName(code).toLowerCase().includes(term)
    );
  }, [currencyCodes, search]);

  return (
    <section className="page-section">
      <PageHeading
        tone={source.tone}
        eyebrow={source.eyebrow}
        title={source.title}
        description={source.description}
        source={source.source}
        sourceMark={source.sourceMark}
      />

      <MethodStrip
        tone={source.tone}
        icon="{ }"
        title={source.methodTitle}
        description={source.methodDescription}
        meta={source.methodMeta}
      />

      <div className="latest-controls">
        <label className="base-select-label">
          <span>Base currency</span>
          <select value={baseCurrency} onChange={(event) => setBaseCurrency(event.target.value)}>
            {BASE_CURRENCIES.map((code) => <option key={code} value={code}>{code} · {currencyName(code)}</option>)}
          </select>
        </label>
        <div className="update-label">
          <span className="update-dot" /> {loading ? "Updating rates" : error ? "Update failed" : "Rate set loaded"}
        </div>
      </div>

      {error && <Notice title="Couldn’t load latest rates" message={error} />}

      {!error && <>
        <LatestMetrics
          baseCurrency={baseCurrency}
          data={data}
          loading={loading}
          currencyCount={currencyCodes.length}
          updatedLabel={source.updatedLabel}
          updatedCaption={source.updatedCaption}
        />

        <ConversionCard
          baseCurrency={data?.base_code || baseCurrency}
          amount={amount}
          onAmountChange={(event) => setAmount(event.target.value)}
          currencyCodes={currencyCodes}
          targetCurrency={targetCurrency}
          onTargetCurrencyChange={(event) => setTargetCurrency(event.target.value)}
          rates={rates}
          loading={loading}
        />

        <div className="rates-section-head">
          <div>
            <div className="card-kicker">CONVERSION TABLE</div>
            <h2>Rates against {data?.base_code || baseCurrency}</h2>
          </div>
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search currency"
              aria-label="Search currencies"
            />
          </label>
        </div>

        {loading && <LoadingSkeleton />}
        {!loading && data && (
          <CurrencyRatesTable
            data={data}
            rates={rates}
            visibleCurrencies={visibleCurrencies}
            search={search}
            footerNote={source.tableFootnote}
          />
        )}
      </>}
    </section>
  );
}

export default LatestRatesPage;
