import { Route, Routes } from "react-router-dom";
import EmployeeDetails from "./employee-details";
import HrmsDashboardFeature from "./dashboard";

export default function HRMS() {
  return (
    <Routes>
      <Route path="dashboard/*" element={<HrmsDashboardFeature />} />
      <Route path="employee-details/*" element={<EmployeeDetails />} />
      <Route path="*" element={<HrmsDashboardFeature />} />
    </Routes>
  );
}
