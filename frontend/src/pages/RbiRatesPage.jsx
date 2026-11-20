import { useCallback, useEffect, useState } from "react";
import MethodStrip from "../components/MethodStrip.jsx";
import PageHeading from "../components/PageHeading.jsx";
import RbiDateRangeForm from "../components/rbi/RbiDateRangeForm.jsx";
import RbiRatesResults from "../components/rbi/RbiRatesResults.jsx";
import { getRbiRates } from "../services/rbiRates.js";
import { toLocalInputDate } from "../utils/date.js";

function initialRange() {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 6);
  return { from: toLocalInputDate(from), to: toLocalInputDate(to) };
}

function RbiRatesPage() {
  const [range, setRange] = useState(initialRange);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRates = useCallback(async (requestedRange = range) => {
    setLoading(true);
    setError("");
    try {
      const result = await getRbiRates(requestedRange);
      setData(result);
    } catch (requestError) {
      setError(requestError.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    loadRates();
  }, []); // Load the initial recent date range once.

  function updateRange(event) {
    setRange((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function submitRange(event) {
    event.preventDefault();
    loadRates(range);
  }

  return (
    <section className="page-section">
      <PageHeading
        eyebrow="SOURCE 01 · OFFICIAL REFERENCE"
        title="RBI reference rates"
        description="Historical rupee reference rates collected from the Reserve Bank of India archive."
        source="Reserve Bank of India"
        sourceMark="R"
      />

      <MethodStrip
        icon="⌁"
        title="Archive form request"
        description="Backend opens RBI’s form, submits the selected dates, then reads the returned table."
        meta="Date range"
      />

      <div className="content-grid">
        <RbiDateRangeForm
          range={range}
          loading={loading}
          onSubmit={submitRange}
          onChange={updateRange}
        />
        <RbiRatesResults range={range} data={data} loading={loading} error={error} />
      </div>
    </section>
  );
}

export default RbiRatesPage;
