import { Route, Routes } from "react-router-dom";
import AdminDashboardPage from "./pages/AdminDashboardPage";

export default function AdminModule() {
  return (
    <Routes>
      <Route index element={<AdminDashboardPage />} />
      <Route path="dashboard" element={<AdminDashboardPage />} />
    </Routes>
  );
}
