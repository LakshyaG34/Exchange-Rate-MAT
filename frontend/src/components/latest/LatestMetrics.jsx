import { formatApiDate } from "../../utils/format.js";
import { currencyName } from "../../utils/currency.js";

function LatestMetrics({ baseCurrency, data, loading, currencyCount }) {
  const activeBase = data?.base_code || baseCurrency;

  return (
    <div className="metric-grid">
      <article className="metric-card metric-card-featured">
        <span className="metric-label">BASE CURRENCY</span>
        <div className="metric-main">
          <span className="metric-code">{activeBase}</span>
          <span className="metric-currency-name">{currencyName(activeBase)}</span>
        </div>
        <span className="metric-caption">All values are quoted per 1 {activeBase}</span>
      </article>
      <article className="metric-card">
        <span className="metric-label">CURRENCIES AVAILABLE</span>
        <div className="metric-main">
          <span className="metric-number">{loading ? "—" : currencyCount}</span>
          <span className="metric-unit">codes</span>
        </div>
        <span className="metric-caption">In this API response</span>
      </article>
      <article className="metric-card">
        <span className="metric-label">LAST UPDATED</span>
        <div className="metric-date">{loading ? "Fetching…" : formatApiDate(data?.time_last_update_utc)}</div>
        <span className="metric-caption">Source update timestamp</span>
      </article>
    </div>
  );
}

export default LatestMetrics;
