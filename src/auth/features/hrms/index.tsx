import { Route, Routes } from "react-router-dom";
import EmployeeDetails from "./employee-details";

export default function HRMS() {
  return (
    <Routes>
      <Route path="employee-details/*" element={<EmployeeDetails />} />
    </Routes>
  );
}
