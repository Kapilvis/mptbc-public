import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard";
import DemandApproval from "./demand-approval";
import DepartmentDemand from "./department-demand";
import TitleReceivedList from "./title-received/pages/TitleReceivedList";
import TitleApprovalList from "./title-approval/pages/TitleApprovalList";
import PaperDistributionList from "./paper-distribution/pages/PaperDistributionList";
import DistributionHistoryList from "./paper-distribution/pages/DistributionHistoryList";
import PrinterDemandMapping from "./printer-demand-mapping";
import PaperIssueToPrinterPage from "./paper-issue-to-printer/pages/PaperIssueToPrinterPage";
import CreatePaperIssuePage from "./paper-issue-to-printer/pages/CreatePaperIssuePage";
import DepotDemandDistribution from "./depot-demand-distribution";

export default function Distribution() {
  return (
    <Routes>
      <Route path="department-demand/*" element={<DepartmentDemand />} />
      <Route path="dashboard/*" element={<Dashboard />} />
      <Route
        path="depot-demand-distribution/*"
        element={<DepotDemandDistribution />}
      />
      <Route path="demand-approval/*" element={<DemandApproval />} />
      <Route
        path="printer-demand-mapping/*"
        element={<PrinterDemandMapping />}
      />
      <Route path="title-received" element={<TitleReceivedList />} />
      <Route path="title-approval" element={<TitleApprovalList />} />
      <Route path="new" element={<PaperDistributionList />} />
      <Route path="history" element={<DistributionHistoryList />} />
      <Route
        path="paper-issue-to-printer"
        element={<PaperIssueToPrinterPage />}
      />
      <Route
        path="paper-issue-to-printer/create"
        element={<CreatePaperIssuePage />}
      />
    </Routes>
  );
}
