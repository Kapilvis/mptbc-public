import { Route, Routes } from "react-router-dom";
import AgencyWiseDemandReportPage from "./agency-wise-demand/pages/AgencyWiseDemandReportPage";
import DepotWiseDistrictTextbookSupplyStatusPage from "./depot-wise-district-textbook-supply-status/pages/DepotWiseDistrictTextbookSupplyStatusPage";
import DepotBlockTitleSupplyReportPage from "./depot-block-title-supply/pages/DepotBlockTitleSupplyReportPage";
import BlockWiseTextbookDemandReportPage from "./block-wise-textbook-demand/pages/BlockWiseTextbookDemandReportPage";
import ReportsPage from "./central-depot-reports/pages/ReportsPage";

export default function Reports() {
  return (
    <Routes>
      <Route
        path="block-wise-textbook-demand"
        element={<BlockWiseTextbookDemandReportPage />}
      />
      <Route
        path="depot-block-title-supply"
        element={<DepotBlockTitleSupplyReportPage />}
      />
      <Route
        path="depot-wise-district-textbook-supply-status"
        element={<DepotWiseDistrictTextbookSupplyStatusPage />}
      />
      <Route
        path="agency-wise-demand"
        element={<AgencyWiseDemandReportPage />}
      />
      <Route
        path="gsm-stock"
        element={<ReportsPage defaultTab="gsm-stock" hideTabs={true} />}
      />
      <Route
        path="printer-orders"
        element={<ReportsPage defaultTab="printer-orders" hideTabs={true} />}
      />
      <Route
        path="printer-supply"
        element={<ReportsPage defaultTab="printer-supply" hideTabs={true} />}
      />
      <Route
        path="distributions"
        element={<ReportsPage defaultTab="distributions" hideTabs={true} />}
      />
    </Routes>
  );
}
