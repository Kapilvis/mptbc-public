import { Route, Routes } from "react-router";
import List from "./pages/List";

export default function OfficeLevel() {
  return (
    <Routes>
      <Route path="/*" element={<List />} />
    </Routes>
  );
}
