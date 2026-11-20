import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout.jsx";
import LatestRatesPage from "./pages/LatestRatesPage.jsx";
import RbiRatesPage from "./pages/RbiRatesPage.jsx";

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/rbi" replace />} />
        <Route path="/rbi" element={<RbiRatesPage />} />
        <Route path="/latest" element={<LatestRatesPage />} />
        <Route path="*" element={<Navigate to="/rbi" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
