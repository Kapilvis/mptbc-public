import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./dashboard/pages/Dashboard";

export default function CentralDepotModule() {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />

      {/* Fallback to Dashboard */}
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
