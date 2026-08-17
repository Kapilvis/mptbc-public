import { Route, Routes } from "react-router-dom";
import TenderManagementModule from "./tender-management";
import CommercialBid from "./commercial-bid";
import TechnicalEvaluation from "./technical-evaluation";
import L1Selection from "./l1-selection";
import WorkOrderModule from "./work-order";
import DispatchPage from "./dispatch/pages/DispatchPage";
import TrackingPage from "./tracking/pages/TrackingPage";
import PodSubmissionPage from "./pod/pages/PodSubmissionPage";
import BillingEnginePage from "./billing/pages/BillingEnginePage";
import DisbursementPage from "./payment/pages/DisbursementPage";
import ReportsPage from "./reports/pages/ReportsPage";

export default function Transportation() {
  return (
    <Routes>
      <Route path="tender-management/*" element={<TenderManagementModule />} />
      <Route path="commercial-bid/*" element={<CommercialBid />} />
      <Route path="technical-evaluation/*" element={<TechnicalEvaluation />} />
      <Route path="l1-selection/*" element={<L1Selection />} />
      <Route path="work-order/*" element={<WorkOrderModule />} />
      <Route path="dispatch/*" element={<DispatchPage />} />
      <Route path="tracking/*" element={<TrackingPage />} />
      <Route path="pod/*" element={<PodSubmissionPage />} />
      <Route path="billing/*" element={<BillingEnginePage />} />
      <Route path="disbursement/*" element={<DisbursementPage />} />
      <Route path="reports/*" element={<ReportsPage />} />
    </Routes>
  );
}
