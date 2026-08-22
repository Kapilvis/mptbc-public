import { Route, Routes } from "react-router-dom";
import FinanceDashboardFeature from "./dashboard";

export default function FinanceModule() {
  return (
    <Routes>
      <Route path="dashboard/*" element={<FinanceDashboardFeature />} />
      <Route path="*" element={<FinanceDashboardFeature />} />
    </Routes>
  );
}
