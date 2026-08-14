import { Route, Routes } from "react-router-dom";
import DepotWiseDistrictTextbookSupplyStatusPage from "./depot-wise-district-textbook-supply-status/pages/DepotWiseDistrictTextbookSupplyStatusPage";

export default function Reports() {
  return (
    <Routes>
      <Route
        path="depot-wise-district-textbook-supply-status"
        element={<DepotWiseDistrictTextbookSupplyStatusPage />}
      />
    </Routes>
  );
}
