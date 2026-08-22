import { Route, Routes } from "react-router-dom";
import FinanceDashboard from "./pages/FinanceDashboard";

export default function FinanceDashboardFeature() {
  return (
    <Routes>
      <Route path="/" element={<FinanceDashboard />} />
    </Routes>
  );
}
