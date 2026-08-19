import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import { GsmSupplyBarChart } from "../components/GsmSupplyBarChart";
import { KpiCards } from "../components/KpiCards";
import { SupplyPipelineWidget } from "../components/SupplyPipelineWidget";
import { VendorPerformanceMatrixTable } from "../components/VendorPerformanceMatrixTable";
import {
  useGsmSupplyDataQuery,
  usePaperDashboardMetricsQuery,
  useSupplyPipelineStagesQuery,
  useVendorPerformanceMatrixQuery,
} from "../queries";

export default function DashboardPage() {
  const pageTitle = usePageTitle();
  const [academicYear, setAcademicYear] = useState("2026-2027");

  const { data: rawMetrics = [] } = usePaperDashboardMetricsQuery();
  const { data: rawPipelineStages = [] } = useSupplyPipelineStagesQuery();
  const { data: rawGsmData = [] } = useGsmSupplyDataQuery();
  const { data: vendorMatrix = [], isLoading: isMatrixLoading } =
    useVendorPerformanceMatrixQuery();

  // Adjust metrics based on academic year
  const metrics = useMemo(() => {
    if (academicYear === "2025-2026") {
      return rawMetrics.map((m, idx) => {
        if (idx === 0)
          return {
            ...m,
            value: "3,520 MT",
            subValue: "",
          };
        if (idx === 1)
          return { ...m, value: "3,520 MT", badgeText: "100% Allocated" };
        if (idx === 2)
          return { ...m, value: "3,480 MT", badgeText: "98.8% Fulfilled" };
        return m;
      });
    }
    if (academicYear === "2024-2025") {
      return rawMetrics.map((m, idx) => {
        if (idx === 0)
          return {
            ...m,
            value: "3,210 MT",
            subValue: "",
          };
        if (idx === 1)
          return { ...m, value: "3,210 MT", badgeText: "100% Allocated" };
        if (idx === 2)
          return { ...m, value: "3,210 MT", badgeText: "100% Fulfilled" };
        return m;
      });
    }
    return rawMetrics;
  }, [rawMetrics, academicYear]);

  const filteredVendorMatrix = useMemo(() => {
    if (!academicYear) return vendorMatrix;
    return vendorMatrix.filter(
      (v) => !v.academicYear || v.academicYear === academicYear,
    );
  }, [vendorMatrix, academicYear]);

  return (
    <Page
      header={pageTitle || "Paper Vendor & Supply Chain Dashboard"}
      showHeaderActions
    >
      {/* Academic Year Filter Bar */}
      <AcademicYearFilterBar
        academicYear={academicYear}
        onChange={setAcademicYear}
      />

      {/* Top 4 KPI Summary Cards */}
      <KpiCards metrics={metrics} />

      {/* 4-Stage Paper Supply Fulfillment Pipeline Widget */}
      <SupplyPipelineWidget stages={rawPipelineStages} />

      {/* Analytical Charts Row (GSM Supply Bar Chart) */}
      <div className="mb-6">
        <GsmSupplyBarChart data={rawGsmData} />
      </div>

      {/* Paper Mill Vendor Supply Performance Matrix Data Table */}
      <VendorPerformanceMatrixTable
        data={
          filteredVendorMatrix.length > 0 ? filteredVendorMatrix : vendorMatrix
        }
        loading={isMatrixLoading}
      />
    </Page>
  );
}
