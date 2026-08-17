import { Route, Routes } from "react-router-dom";
import AgencyWiseDemandReportPage from "./agency-wise-demand/pages/AgencyWiseDemandReportPage";
import DepotWiseDistrictTextbookSupplyStatusPage from "./depot-wise-district-textbook-supply-status/pages/DepotWiseDistrictTextbookSupplyStatusPage";

export default function Reports() {
  return (
    <Routes>
      <Route
        path="depot-wise-district-textbook-supply-status"
        element={<DepotWiseDistrictTextbookSupplyStatusPage />}
      />
      <Route
        path="agency-wise-demand"
        element={<AgencyWiseDemandReportPage />}
      />
    </Routes>
  );
}
