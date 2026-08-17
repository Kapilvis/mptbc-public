import { Route, Routes } from "react-router-dom";
import DepotDashboard from "./pages/DepotDashboard";

export default function Dashboard() {
  return (
    <Routes>
      <Route index element={<DepotDashboard />} />
    </Routes>
  );
}
