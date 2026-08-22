import { Route, Routes } from "react-router-dom";
import LegalDashboardRouter from "./dashboard";

export default function LegalModule() {
  return (
    <Routes>
      <Route path="dashboard/*" element={<LegalDashboardRouter />} />
      <Route index element={<LegalDashboardRouter />} />
    </Routes>
  );
}
