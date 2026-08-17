import { Route, Routes } from "react-router-dom";
import TransportOrdersPage from "./pages/TransportOrdersPage";
import VehicleManagementPage from "./pages/VehicleManagementPage";
import FuelLogPage from "./pages/FuelLogPage";

export default function TransportModule() {
  return (
    <Routes>
      <Route path="orders" element={<TransportOrdersPage />} />
      <Route path="vehicles" element={<VehicleManagementPage />} />
      <Route path="fuel-log" element={<FuelLogPage />} />
    </Routes>
  );
}
