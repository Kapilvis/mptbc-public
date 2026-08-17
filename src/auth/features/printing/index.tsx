import { Route, Routes } from "react-router-dom";
import PrinterRegistration from "./printer-registration";

export default function Printing() {
  return (
    <Routes>
      <Route path="printer-registration/*" element={<PrinterRegistration />} />
    </Routes>
  );
}
