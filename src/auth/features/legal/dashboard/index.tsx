import { Route, Routes } from "react-router-dom";
import LegalDashboard from "./pages/LegalDashboard";

export default function LegalDashboardRouter() {
  return (
    <Routes>
      <Route index element={<LegalDashboard />} />
    </Routes>
  );
}
