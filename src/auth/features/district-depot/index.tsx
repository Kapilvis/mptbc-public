import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard";
import PrinterModule from "./printer";
import DispatchModule from "./dispatch";
import TransportModule from "./transport";

export default function DistrictDepot() {
  return (
    <Routes>
      <Route path="dashboard/*" element={<Dashboard />} />
      <Route path="printer/*" element={<PrinterModule />} />
      <Route path="dispatch/*" element={<DispatchModule />} />
      <Route path="transport/*" element={<TransportModule />} />
    </Routes>
  );
}
