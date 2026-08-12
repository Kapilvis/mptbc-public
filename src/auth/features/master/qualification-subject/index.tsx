import { Route, Routes } from "react-router";
import List from "./pages/List";

export default function QualificationSubject() {
  return (
    <Routes>
      <Route path="/*" element={<List />} />
    </Routes>
  );
}
