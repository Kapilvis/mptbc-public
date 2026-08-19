import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import { DemandApprovalPipelineWidget } from "../components/DemandApprovalPipelineWidget";
import { DemandSupplyBarChart } from "../components/DemandSupplyBarChart";
import { DistrictMatrixTable } from "../components/DistrictMatrixTable";
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
        if (idx === 0) return { ...m, value: "4.20 Cr" };
        if (idx === 1) return { ...m, value: "3.80 Cr" };
        if (idx === 2) return { ...m, value: "2.40 Cr" };
        if (idx === 3) return { ...m, value: "2.00 Cr" };
        if (idx === 4) return { ...m, value: "1.15 Cr" };
        return m;
      });
    }
    if (academicYear === "2024-2025") {
      return rawMetrics.map((m, idx) => {
        if (idx === 0) return { ...m, value: "4.00 Cr" };
        if (idx === 1) return { ...m, value: "3.60 Cr" };
        if (idx === 2) return { ...m, value: "2.30 Cr" };
        if (idx === 3) return { ...m, value: "1.90 Cr" };
        if (idx === 4) return { ...m, value: "1.10 Cr" };
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

      {/* Main Charts Row (Demand vs Supply Bar Chart) */}
      <div className="mb-6">
        <DemandSupplyBarChart />
      </div>

      {/* Title Wise Textbook Distribution Report Data Matrix Section */}
      <DistrictMatrixTable
        data={filteredMatrix.length > 0 ? filteredMatrix : matrixData}
        loading={isMatrixLoading}
      />
    </Page>
  );
}
