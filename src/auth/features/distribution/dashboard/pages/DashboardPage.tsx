import Page from "shared/components/panels/Page";
import { DemandApprovalPipelineWidget } from "../components/DemandApprovalPipelineWidget";
import { DemandSupplyBarChart } from "../components/DemandSupplyBarChart";
import { DistrictMatrixTable } from "../components/DistrictMatrixTable";
import { FulfillmentDonutChart } from "../components/FulfillmentDonutChart";
import { KpiCards } from "../components/KpiCards";
import { useDashboardMetricsQuery, useDistrictMatrixQuery } from "../queries";

export default function DashboardPage() {
  const { data: metrics = [] } = useDashboardMetricsQuery();
  const { data: matrixData = [], isLoading: isMatrixLoading } =
    useDistrictMatrixQuery();

  return (
    <Page
      header="Consolidated Distribution Dashboard"
      subHeader="Consolidated distribution metrics, fulfillment tracking, and district/block supply status."
      showHeaderActions
    >
      {/* Top 4 KPI Cards */}
      <KpiCards metrics={metrics} />

      {/* Demand Approval Pipeline Status Row Widget (Progress Slider Bars + Pending Donut) */}
      <DemandApprovalPipelineWidget />

      {/* Main Charts Row (Demand vs Supply Bar Chart + Fulfillment Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <DemandSupplyBarChart />
        </div>
        <div className="lg:col-span-1">
          <FulfillmentDonutChart />
        </div>
      </div>

      {/* Title Wise Textbook Distribution Report Data Matrix Section */}
      <DistrictMatrixTable data={matrixData} loading={isMatrixLoading} />
    </Page>
  );
}
