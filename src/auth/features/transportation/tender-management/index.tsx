import { TenderManagement } from "./pages/TenderManagementPage";
import { Route, Routes } from "react-router-dom";

export default function TenderManagementModule() {
  return (
    <Routes>
      <Route index element={<TenderManagement />} />
    </Routes>
  );
}
