import { Route, Routes, Navigate } from "react-router-dom";
import TenderDetailsPage from "./tender-details/pages/TenderDetailsPage";
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
      <Route path="tender-details/*" element={<TenderDetailsPage />} />
      <Route path="work-order/*" element={<WorkOrderModule />} />
      <Route path="dispatch/*" element={<DispatchPage />} />
      <Route path="tracking/*" element={<TrackingPage />} />
      <Route path="pod/*" element={<PodSubmissionPage />} />
      <Route path="billing/*" element={<BillingEnginePage />} />
      <Route path="disbursement/*" element={<DisbursementPage />} />
      <Route path="reports/*" element={<ReportsPage />} />
      <Route path="*" element={<Navigate to="tender-details" replace />} />
    </Routes>
  );
}
