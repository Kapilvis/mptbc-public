import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import { KpiCards } from "auth/features/distribution/dashboard/components/KpiCards";
import { PrinterReceiptBarChart } from "../components/PrinterReceiptBarChart";
import { TitleStockTable } from "../components/TitleStockTable";
import {
  BlockSupplyStatusTable,
  RecentActivities,
} from "../components/BlockSupplyStatusTable";
import {
  depotKpiMetrics as rawDepotMetrics,
  printerReceiptChartData,
  titleStockData,
  blockSupplyData,
  recentActivities,
} from "../data";

export default function DepotDashboard() {
  const [academicYear, setAcademicYear] = useState("2026-2027");

  const depotKpiMetrics = useMemo(() => {
    if (academicYear === "2025-2026") {
      return rawDepotMetrics.map((m, idx) => {
        if (idx === 0)
          return { ...m, value: "1,450,000", badgeText: "100% Received" };
        if (idx === 1)
          return { ...m, value: "1,442,000", badgeText: "99.4% Dispatched" };
        if (idx === 2) return { ...m, value: "8,000", badgeText: "Balanced" };
        return m;
      });
    }
    if (academicYear === "2024-2025") {
      return rawDepotMetrics.map((m, idx) => {
        if (idx === 0)
          return { ...m, value: "1,380,000", badgeText: "Archived" };
        if (idx === 1)
          return { ...m, value: "1,380,000", badgeText: "100% Dispatched" };
        if (idx === 2) return { ...m, value: "0", badgeText: "Zero Stock" };
        return m;
      });
    }
    return rawDepotMetrics;
  }, [academicYear]);

  return (
    <Page
      header="District Depot Dashboard"
      subHeader="जिला डिपो — Stock, printer receipt, dispatch status, and block-wise supply overview."
      showHeaderActions
    >
      {/* Academic Year Filter Bar */}
      <AcademicYearFilterBar
        academicYear={academicYear}
        onChange={setAcademicYear}
        subtitle={`Filtering district depot receipt challans, textbook stock, and block dispatches for session ${academicYear}.`}
      />

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
