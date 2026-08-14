import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard";
import DepartmentDemand from "./department-demand";

export default function Distribution() {
  return (
    <Routes>
      <Route path="department-demand/*" element={<DepartmentDemand />} />
      <Route path="dashboard/*" element={<Dashboard />} />
    </Routes>
  );
}
