import { Route, Routes } from "react-router-dom";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import List from "./pages/List";

export default function PaperSupplyDispatchModule() {
  return (
    <Routes>
      <Route index element={<List />} />
      <Route path="create" element={<Create />} />
      <Route path="edit/:id" element={<Edit />} />
    </Routes>
  );
}
