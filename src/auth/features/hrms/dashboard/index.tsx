import { Route, Routes } from "react-router-dom";
import HrmsDashboard from "./pages/Dashboard";

export default function HrmsDashboardFeature() {
  return (
    <Routes>
      <Route path="/" element={<HrmsDashboard />} />
    </Routes>
  );
}
