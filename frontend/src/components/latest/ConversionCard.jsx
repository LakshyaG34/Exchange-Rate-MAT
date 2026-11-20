import { formatRate } from "../../utils/format.js";
import { currencyName } from "../../utils/currency.js";

function ConversionCard({
  baseCurrency,
  amount,
  onAmountChange,
  currencyCodes,
  targetCurrency,
  onTargetCurrencyChange,
  rates,
  loading,
}) {
  const activeBase = baseCurrency || "USD";
  const convertedAmount = Number(amount) * Number(rates[targetCurrency]);

  return (
    <div className="conversion-card">
      <div className="conversion-copy">
        <div className="card-kicker">QUICK CONVERSION</div>
        <h2>Convert from {activeBase}</h2>
        <p>Uses the same rate table loaded below.</p>
      </div>
      <div className="conversion-fields">
        <label>
          <span>Amount</span>
          <input type="number" min="0" step="any" value={amount} onChange={onAmountChange} />
        </label>
        <span className="convert-arrow" aria-hidden="true">→</span>
        <label>
          <span>Convert to</span>
          <select value={targetCurrency} onChange={onTargetCurrencyChange}>
            {currencyCodes.map((code) => <option key={code} value={code}>{code} · {currencyName(code)}</option>)}
          </select>
        </label>
        <div className="conversion-result" aria-live="polite">
          <span>RESULT</span>
          <strong>{loading || !Number.isFinite(convertedAmount) ? "—" : `${formatRate(convertedAmount, 6)} ${targetCurrency}`}</strong>
        </div>
      </div>
    </div>
  );
}

export default ConversionCard;
