import { Route, Routes } from "react-router-dom";
import List from "./pages/List";
import Create from "./pages/Create";
import Edit from "./pages/Edit";

export default function PrinterQualityInspection() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="create" element={<Create />} />
      <Route path="edit/:inspectionId" element={<Edit />} />
    </Routes>
  );
}
