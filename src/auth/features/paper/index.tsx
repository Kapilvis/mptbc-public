import { Route, Routes } from "react-router-dom";
import GsmDemandReportList from "./gsm-demand-report/pages/GsmDemandReportList";
import PaperOrderAllocation from "./paper-order-allocation";
import PaperTenderRaiseForm from "./paper-tender-raise/pages/PaperTenderRaiseForm";
import PaperVendorProfile from "./paper-vendor-profile";
import PaperStockPage from "./paper-stock/pages/PaperStockPage";
import PaperReceivingPage from "./paper-receiving/pages/PaperReceivingPage";
import StockTransactionsPage from "./stock-transactions/pages/StockTransactionsPage";
import StockLedgerPage from "./stock-ledger/pages/StockLedgerPage";

export default function PaperModule() {
  return (
    <Routes>
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
    </Routes>
  );
}
