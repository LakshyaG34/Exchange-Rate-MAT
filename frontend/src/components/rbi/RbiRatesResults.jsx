import LoadingSkeleton from "../LoadingSkeleton.jsx";
import Notice from "../Notice.jsx";
import { displayDate } from "../../utils/date.js";

function RbiRatesResults({ range, data, loading, error }) {
  return (
    <div className="results-column">
      <div className="result-summary">
        <div>
          <div className="card-kicker">ARCHIVE RESULTS</div>
          <h2>{loading ? "Loading rates…" : `${data?.rates?.length ?? 0} rate records`}</h2>
        </div>
        <div className="range-summary">{displayDate(data?.from || range.from)} <span>→</span> {displayDate(data?.to || range.to)}</div>
      </div>

      {error && <Notice title="Couldn’t load RBI rates" message={error} />}
      {loading && <LoadingSkeleton />}
      {!loading && !error && data?.rates?.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">⌕</div>
          <strong>No rates in this date range</strong>
          <span>Try a wider range or check the dates selected.</span>
        </div>
      )}
      {!loading && !error && data?.rates?.length > 0 && (
        <div className="table-card">
          <div className="table-scroll">
            <table className="rates-table">
              <thead>
                <tr>
                  <th className="date-column">Date</th>
                  {data.currencies.map((currency) => <th key={currency.code}>{currency.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.rates.map((row) => (
                  <tr key={row.date}>
                    <td className="date-cell">{displayDate(row.date)}</td>
                    {data.currencies.map((currency) => (
                      <td key={currency.code}>{row.values[currency.code] ?? "—"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footnote"><span className="footnote-dot" /> Values are shown as returned by the RBI archive.</div>
        </div>
      )}
    </div>
  );
}

export default RbiRatesResults;
