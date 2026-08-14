import { Route, Routes } from "react-router-dom";
import ApprovalList from "./pages/ApprovalList";

export default function DemandApproval() {
  return (
    <Routes>
      <Route path="/*" element={<ApprovalList />} />
    </Routes>
  );
}
