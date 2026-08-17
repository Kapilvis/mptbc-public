import { Route, Routes } from "react-router-dom";
import ChallanToBlockPage from "./pages/ChallanToBlockPage";
import DispatchHistoryPage from "./pages/DispatchHistoryPage";

export default function DispatchModule() {
  return (
    <Routes>
      <Route path="challan-to-block" element={<ChallanToBlockPage />} />
      <Route path="history" element={<DispatchHistoryPage />} />
    </Routes>
  );
}
