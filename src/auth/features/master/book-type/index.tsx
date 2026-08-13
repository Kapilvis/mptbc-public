import { Route, Routes } from "react-router-dom";
import List from "./pages/List";

export default function BookType() {
  return (
    <Routes>
      <Route path="/*" element={<List />} />
    </Routes>
  );
}
