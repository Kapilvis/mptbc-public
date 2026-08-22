import { Route, Routes } from "react-router-dom";
import GrievanceDashboard from "./pages/GrievanceDashboard";

export default function GrievanceDashboardRouter() {
  return (
    <Routes>
      <Route index element={<GrievanceDashboard />} />
    </Routes>
  );
}
