import { useEffect, useMemo, useState } from "react";
import ConversionCard from "../components/latest/ConversionCard.jsx";
import CurrencyRatesTable from "../components/latest/CurrencyRatesTable.jsx";
import LatestMetrics from "../components/latest/LatestMetrics.jsx";
import LoadingSkeleton from "../components/LoadingSkeleton.jsx";
import MethodStrip from "../components/MethodStrip.jsx";
import Notice from "../components/Notice.jsx";
import PageHeading from "../components/PageHeading.jsx";
import { getLatestExchangeRates } from "../services/exchangeRates.js";
import { BASE_CURRENCIES, currencyName } from "../utils/currency.js";

function LatestRatesPage() {
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

    getLatestExchangeRates(baseCurrency)
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
  }, [baseCurrency]);

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
        tone="teal"
        eyebrow="SOURCE 02 · LATEST CONVERSION DATA"
        title="Latest exchange rates"
        description="Live latest-rate response from ExchangeRate-API, with a selectable base currency."
        source="ExchangeRate-API"
        sourceMark="↗"
      />

      <MethodStrip
        tone="teal"
        icon="{ }"
        title="JSON API request"
        description="Frontend calls Express; the API key stays on the backend while it requests the latest JSON rates."
        meta="Latest snapshot"
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
          />
        )}
      </>}
    </section>
  );
}

export default LatestRatesPage;
