import { Route, Routes } from "react-router-dom";
import PrinterDemandMappingListPage from "./pages/PrinterDemandMappingListPage";
import CreatePrinterDemandMappingPage from "./pages/CreatePrinterDemandMappingPage";

export default function PrinterDemandMapping() {
  return (
    <Routes>
      <Route index element={<PrinterDemandMappingListPage />} />
      <Route path="new" element={<CreatePrinterDemandMappingPage />} />
    </Routes>
  );
}
