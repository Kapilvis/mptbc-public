import { Route, Routes } from "react-router-dom";
import GsmDemandReportList from "./gsm-demand-report/pages/GsmDemandReportList";

export default function PaperModule() {
  return (
    <Routes>
      <Route path="gsm-demand-report" element={<GsmDemandReportList />} />
    </Routes>
  );
}
