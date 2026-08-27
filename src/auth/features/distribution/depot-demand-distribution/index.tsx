import { Route, Routes } from "react-router-dom";
import DepotDemandDistributionPage from "./pages/DepotDemandDistributionPage";

export default function DepotDemandDistribution() {
  return (
    <Routes>
      <Route index element={<DepotDemandDistributionPage />} />
    </Routes>
  );
}
