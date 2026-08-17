import { Route, Routes } from "react-router-dom";
import PrinterAssignedDemandPage from "./pages/PrinterAssignedDemandPage";
import PrinterChallanReceivedPage from "./pages/PrinterChallanReceivedPage";

export default function PrinterModule() {
  return (
    <Routes>
      <Route path="assigned-demand" element={<PrinterAssignedDemandPage />} />
      <Route path="challan-received" element={<PrinterChallanReceivedPage />} />
    </Routes>
  );
}
