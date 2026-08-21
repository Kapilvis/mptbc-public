import { Route, Routes } from "react-router-dom";
import List from "./pages/List";
import Create from "./pages/Create";
import Receive from "./pages/Receive";
import Edit from "./pages/Edit";

export default function PaperLabTesting() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="create" element={<Create />} />
      <Route path="receive/:id" element={<Receive />} />
      <Route path="edit/:id" element={<Edit />} />
    </Routes>
  );
}
