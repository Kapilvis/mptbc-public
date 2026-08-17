import { Route, Routes } from "react-router-dom";
import List from "./pages/List";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import View from "./pages/View";

export default function DepotRegistration() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="add" element={<Create />} />
      <Route path=":id/edit" element={<Edit />} />
      <Route path=":id/view" element={<View />} />
    </Routes>
  );
}
