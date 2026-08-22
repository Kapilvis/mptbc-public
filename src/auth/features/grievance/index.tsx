import { Route, Routes } from "react-router-dom";
import GrievanceDashboardRouter from "./dashboard";

export default function GrievanceModule() {
  return (
    <Routes>
      <Route path="dashboard/*" element={<GrievanceDashboardRouter />} />
      <Route index element={<GrievanceDashboardRouter />} />
    </Routes>
  );
}
