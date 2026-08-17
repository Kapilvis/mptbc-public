import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard";
import DemandApproval from "./demand-approval";
import DepartmentDemand from "./department-demand";
import TitleApprovalList from "./title-approval/pages/TitleApprovalList";

export default function Distribution() {
  return (
    <Routes>
      <Route path="department-demand/*" element={<DepartmentDemand />} />
      <Route path="dashboard/*" element={<Dashboard />} />
      <Route path="demand-approval/*" element={<DemandApproval />} />
      <Route path="title-approval" element={<TitleApprovalList />} />
    </Routes>
  );
}
