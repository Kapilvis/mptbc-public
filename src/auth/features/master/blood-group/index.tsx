import { Route, Routes } from "react-router-dom";
import List from "./pages/List";

export default function BloodGroup() {
  return (
    <Routes>
      <Route path="/*" element={<List />} />
    </Routes>
  );
}
