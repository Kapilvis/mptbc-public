import Page from "shared/components/panels/Page";
import { KpiCards } from "auth/features/distribution/dashboard/components/KpiCards";
import { PrinterReceiptBarChart } from "../components/PrinterReceiptBarChart";
import { TitleStockTable } from "../components/TitleStockTable";
import {
  BlockSupplyStatusTable,
  RecentActivities,
} from "../components/BlockSupplyStatusTable";
import {
  depotKpiMetrics,
  printerReceiptChartData,
  titleStockData,
  blockSupplyData,
  recentActivities,
} from "../data";

export default function DepotDashboard() {
  return (
    <Page
      header="District Depot Dashboard"
      subHeader="जिला डिपो — Stock, printer receipt, dispatch status, and block-wise supply overview."
      showHeaderActions
    >
      {/* KPI Cards Row */}
      <KpiCards metrics={depotKpiMetrics} />

      {/* Printer Receipt Chart + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <PrinterReceiptBarChart data={printerReceiptChartData} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivities activities={recentActivities} />
        </div>
      </div>

      {/* Title Stock Table + Block Supply Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <TitleStockTable data={titleStockData} />
        <BlockSupplyStatusTable data={blockSupplyData} />
      </div>
    </Page>
  );
}
