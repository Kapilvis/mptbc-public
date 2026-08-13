import { Route, Routes } from "react-router-dom";
import PrinterList from "./pages/PrinterList";
import PrinterRegistration from "./pages/PrinterRegistration";

export default function Printing() {
  return (
    <Routes>
      <Route path="printer-registration" element={<PrinterList />} />
      <Route
        path="printer-registration/create"
        element={<PrinterRegistration />}
      />
      <Route index element={<PrinterList />} />
    </Routes>
  );
}
