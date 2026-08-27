import { Route, Routes } from "react-router-dom";
import DepotToDepotPage from "./pages/DepotToDepotPage";

export default function DepotToDepotModule() {
  return (
    <Routes>
      <Route path="/" element={<DepotToDepotPage />} />
    </Routes>
  );
}
