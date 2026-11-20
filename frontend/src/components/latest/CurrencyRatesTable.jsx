import { formatApiDate, formatRate } from "../../utils/format.js";
import { currencyName } from "../../utils/currency.js";

function CurrencyRatesTable({ data, rates, visibleCurrencies, search }) {
  return (
    <div className="table-card">
      <div className="table-scroll latest-table-scroll">
        <table className="rates-table latest-table">
          <thead>
            <tr><th>Currency</th><th>Code</th><th className="align-right">Rate</th><th className="align-right">Compared to base</th></tr>
          </thead>
          <tbody>
            {visibleCurrencies.map((code) => (
              <tr key={code}>
                <td className="currency-name-cell">
                  <span className="currency-token">{code.slice(0, 2)}</span>
                  <span>{currencyName(code)}</span>
                </td>
                <td><span className="code-chip">{code}</span></td>
                <td className="align-right rate-number">{formatRate(rates[code], 6)}</td>
                <td className="align-right rate-context">1 {data.base_code} <span>→</span> {code}</td>
              </tr>
            ))}
            {visibleCurrencies.length === 0 && (
              <tr><td className="no-match" colSpan="4">No currencies match “{search}”.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footnote">
        <span className="footnote-dot footnote-dot-teal" /> Next scheduled update: {formatApiDate(data.time_next_update_utc)}
      </div>
    </div>
  );
}

export default CurrencyRatesTable;
