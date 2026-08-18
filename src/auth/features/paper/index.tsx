import { Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard";
import GsmDemandReportList from "./gsm-demand-report/pages/GsmDemandReportList";
import PaperOrderAllocation from "./paper-order-allocation";
import PaperReceivingPage from "./paper-receiving/pages/PaperReceivingPage";
import PaperStockPage from "./paper-stock/pages/PaperStockPage";
import PaperSupplyDispatchModule from "./paper-supply-dispatch";
import PaperTenderRaiseForm from "./paper-tender-raise/pages/PaperTenderRaiseForm";
import PaperVendorProfile from "./paper-vendor-profile";
import StockLedgerPage from "./stock-ledger/pages/StockLedgerPage";
import StockTransactionsPage from "./stock-transactions/pages/StockTransactionsPage";

export default function PaperModule() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="gsm-demand-report" element={<GsmDemandReportList />} />
      <Route path="paper-tender-raise" element={<PaperTenderRaiseForm />} />
      <Route path="paper-vendor-profile/*" element={<PaperVendorProfile />} />
      <Route path="stock/main" element={<PaperStockPage />} />
      <Route path="stock/receiving" element={<PaperReceivingPage />} />
      <Route path="stock/transactions" element={<StockTransactionsPage />} />
      <Route path="stock/ledger" element={<StockLedgerPage />} />
      <Route
        path="paper-order-allocation/*"
        element={<PaperOrderAllocation />}
      />
      <Route
        path="paper-supply-dispatch/*"
        element={<PaperSupplyDispatchModule />}
      />
    </Routes>
  );
}
