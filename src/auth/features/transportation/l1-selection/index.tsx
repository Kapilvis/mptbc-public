import { Route, Routes } from "react-router-dom";
import List from "./pages/List";

export default function L1Selection() {
  return (
    <Routes>
      <Route index element={<List />} />
    </Routes>
  );
}
