import { Route, Routes } from "react-router";
import List from "./pages/List";

export default function UserAssignment() {
  return (
    <Routes>
      <Route path="/*" element={<List />} />
    </Routes>
  );
}
