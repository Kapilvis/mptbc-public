import { Route, Routes } from "react-router-dom";
import PrinterRegistration from "./printer-registration";
import PrinterOrdersList from "./printer-orders/pages/PrinterOrdersList";
import PrinterOrderDetail from "./printer-orders/pages/PrinterOrderDetail";
import PrinterDashboard from "./dashboard/PrinterDashboard";
import PrinterQualityInspection from "./quality-inspection";

export default function Printing() {
  return (
    <Routes>
      <Route path="dashboard" element={<PrinterDashboard />} />
      <Route path="printer-registration/*" element={<PrinterRegistration />} />
      <Route
        path="orders/list"
        element={<PrinterOrdersList pendingOnly={false} />}
      />
      <Route
        path="orders/pending"
        element={<PrinterOrdersList pendingOnly={true} />}
      />
      <Route path="orders/details/:orderNo" element={<PrinterOrderDetail />} />
      <Route
        path="quality-inspection/*"
        element={<PrinterQualityInspection />}
      />
    </Routes>
  );
}
