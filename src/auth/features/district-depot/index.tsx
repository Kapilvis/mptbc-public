import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard";
import PrinterModule from "./printer";
import DispatchModule from "./dispatch";
import TransportModule from "./transport";
import DepotToDepotModule from "./depot-to-depot";
import OpeningStockModule from "./opening-stock";

export default function DistrictDepot() {
  return (
    <Routes>
      <Route path="dashboard/*" element={<Dashboard />} />
      <Route path="printer/*" element={<PrinterModule />} />
      <Route path="dispatch/*" element={<DispatchModule />} />
      <Route path="depot-to-depot/*" element={<DepotToDepotModule />} />
      <Route path="opening-stock/*" element={<OpeningStockModule />} />
      <Route path="transport/*" element={<TransportModule />} />
    </Routes>
  );
}
