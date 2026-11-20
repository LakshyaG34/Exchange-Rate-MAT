function RbiDateRangeForm({ range, loading, onSubmit, onChange }) {
  return (
    <aside className="control-card">
      <div className="card-topline">
        <div>
          <div className="card-kicker">QUERY</div>
          <h2>Choose a period</h2>
        </div>
        <span className="step-badge">01</span>
      </div>
      <p className="card-description">Select the archive dates to retrieve the official INR reference values.</p>
      <form className="range-form" onSubmit={onSubmit}>
        <label>
          <span>From date</span>
          <input name="from" type="date" value={range.from} onChange={onChange} required />
        </label>
        <label>
          <span>To date</span>
          <input name="to" type="date" value={range.to} onChange={onChange} required min={range.from} />
        </label>
        <button className="button button-primary" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Fetching archive</> : <>Fetch rates <span aria-hidden="true">→</span></>}
        </button>
      </form>
      <div className="source-note">
        <span className="note-icon">i</span>
        <span>RBI quotes selected currencies as INR per the unit shown in each column.</span>
      </div>
    </aside>
  );
}

export default RbiDateRangeForm;
