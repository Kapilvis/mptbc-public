import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import { DemandApprovalPipelineWidget } from "../components/DemandApprovalPipelineWidget";
import { DemandSupplyBarChart } from "../components/DemandSupplyBarChart";
import { DistrictMatrixTable } from "../components/DistrictMatrixTable";
import { FulfillmentDonutChart } from "../components/FulfillmentDonutChart";
import { KpiCards } from "../components/KpiCards";
import { useDashboardMetricsQuery, useDistrictMatrixQuery } from "../queries";

export default function DashboardPage() {
  const pageTitle = usePageTitle();
  const [academicYear, setAcademicYear] = useState("2026-2027");

  const { data: rawMetrics = [] } = useDashboardMetricsQuery();
  const { data: matrixData = [], isLoading: isMatrixLoading } =
    useDistrictMatrixQuery();

  const metrics = useMemo(() => {
    if (academicYear === "2025-2026") {
      return rawMetrics.map((m, idx) => {
        if (idx === 0)
          return { ...m, value: "3.45 Cr", badgeText: "100% Approved" };
        if (idx === 1)
          return { ...m, value: "3.42 Cr", badgeText: "100% Printed" };
        if (idx === 2)
          return { ...m, value: "3.38 Cr", badgeText: "99.2% Delivered" };
        return m;
      });
    }
    if (academicYear === "2024-2025") {
      return rawMetrics.map((m, idx) => {
        if (idx === 0)
          return { ...m, value: "3.20 Cr", badgeText: "100% Archived" };
        if (idx === 1)
          return { ...m, value: "3.18 Cr", badgeText: "100% Archived" };
        if (idx === 2)
          return { ...m, value: "3.18 Cr", badgeText: "100% Distributed" };
        return m;
      });
    }
    return rawMetrics;
  }, [rawMetrics, academicYear]);

  const filteredMatrix = useMemo(() => {
    if (!academicYear) return matrixData;
    return matrixData.filter(
      (item) => !item.academicYear || item.academicYear === academicYear,
    );
  }, [matrixData, academicYear]);

  return (
    <Page
      header={pageTitle || "Distribution Dashboard"}
      subHeader="Consolidated distribution metrics, fulfillment tracking, and district/block supply status."
      showHeaderActions
    >
      {/* Academic Year Filter Bar */}
      <AcademicYearFilterBar
        academicYear={academicYear}
        onChange={setAcademicYear}
        subtitle={`Filtering textbook distribution, demand approvals, and depot dispatch status for session ${academicYear}.`}
      />

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
      <DistrictMatrixTable
        data={filteredMatrix.length > 0 ? filteredMatrix : matrixData}
        loading={isMatrixLoading}
      />
    </Page>
  );
}
