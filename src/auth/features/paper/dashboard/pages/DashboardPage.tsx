import Page from "shared/components/panels/Page";
import { GsmSupplyBarChart } from "../components/GsmSupplyBarChart";
import { KpiCards } from "../components/KpiCards";
import { OrderStatusDonutChart } from "../components/OrderStatusDonutChart";
import { SupplyPipelineWidget } from "../components/SupplyPipelineWidget";
import { VendorPerformanceMatrixTable } from "../components/VendorPerformanceMatrixTable";
import {
  useGsmSupplyDataQuery,
  usePaperDashboardMetricsQuery,
  useSupplyPipelineStagesQuery,
  useVendorPerformanceMatrixQuery,
} from "../queries";

export default function DashboardPage() {
  const { data: metrics = [] } = usePaperDashboardMetricsQuery();
  const { data: pipelineStages = [] } = useSupplyPipelineStagesQuery();
  const { data: gsmData = [] } = useGsmSupplyDataQuery();
  const { data: vendorMatrix = [], isLoading: isMatrixLoading } =
    useVendorPerformanceMatrixQuery();

  return (
    <Page
      header="Paper Vendor & Supply Chain Dashboard"
      subHeader="Real-time paper tender allocations, work order dispatches, GSM supply metrics, and Central Depot stock receipts."
      showHeaderActions
    >
      {/* Top 4 KPI Summary Cards */}
      <KpiCards metrics={metrics} />

      {/* 4-Stage Paper Supply Fulfillment Pipeline Widget */}
      <SupplyPipelineWidget stages={pipelineStages} />

      {/* Analytical Charts Row (GSM Supply Bar Chart + Order Status Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <GsmSupplyBarChart data={gsmData} />
        </div>
        <div className="lg:col-span-1">
          <OrderStatusDonutChart />
        </div>
      </div>

      {/* Paper Mill Vendor Supply Performance Matrix Data Table */}
      <VendorPerformanceMatrixTable
        data={vendorMatrix}
        loading={isMatrixLoading}
      />
    </Page>
  );
}
