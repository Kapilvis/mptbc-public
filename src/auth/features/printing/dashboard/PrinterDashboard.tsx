import { useEffect, useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import { useAuth } from "../../../AuthProvider";
import { dataManager } from "../../inventory/mockData";
import {
  resolvePrinterDetails,
  getPrinterDashboardStats,
} from "./printerDashboard.mock";

import {
  PrinterKpiCards,
  PrintingProgress,
  OrderStatusChart,
  PaperMaterialStatus,
  SupplyStatus,
} from "./components";
import { usePageTitle } from "shared/hooks/usePageTitle";

export default function PrinterDashboard() {
  const pageTitle = usePageTitle();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [academicYear, setAcademicYear] = useState("2026-2027");

  // Resolve logged-in user to their printer profile details
  const printerInfo = resolvePrinterDetails(
    user?.profile?.name || "PRINTER ADMIN",
  );
  const baseStats = getPrinterDashboardStats(printerInfo.printerCode);

  const stats = useMemo(() => {
    if (academicYear === "2025-2026") {
      return {
        ...baseStats,
        booksPrinted: baseStats.booksPrinted + 150000,
        booksPending: 0,
        supplyPending: 0,
      };
    }
    if (academicYear === "2024-2025") {
      return {
        ...baseStats,
        booksPrinted: baseStats.booksPrinted + 350000,
        booksPending: 0,
        supplyPending: 0,
      };
    }
    return baseStats;
  }, [baseStats, academicYear]);

  useEffect(() => {
    // Seed/reset mock data if it hasn't been seeded in local storage yet
    const orders = dataManager
      .getOrders()
      .filter((o) => o.printerCode === printerInfo.printerCode);
    if (orders.length === 0) {
      dataManager.resetData();
    }

    // Simulate API retrieval for production metrics
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [printerInfo.printerCode]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-112.5 gap-3">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-[#E8F4EC] border-t-[#4F8F70] animate-spin" />
        </div>
        <p className="text-gray-500 font-bold text-sm tracking-wide animate-pulse">
          Loading production dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Page
        header="Error Loading Dashboard"
        subHeader="Production statistics currently unavailable."
      >
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-xl text-center">
          <i className="pi pi-exclamation-triangle text-3xl mb-2 block" />
          <p className="font-bold text-base mb-1">
            Failed to fetch printing stats
          </p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </Page>
    );
  }

  return (
    <Page
      header={pageTitle || "Printer Dashboard"}
      subHeader="Operational console for managing press work orders, print execution progress, paper inventory reconciliation, and depot delivery supply lines."
      showHeaderActions
    >
      <div className="space-y-6">
        {/* Academic Year Filter Bar */}
        <AcademicYearFilterBar
          academicYear={academicYear}
          onChange={setAcademicYear}
          subtitle=""
        />

        {/* 8 Metric Cards Grid */}
        <PrinterKpiCards stats={stats} />

        {/* Row 1: Printing Progress | Order Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <PrintingProgress printerCode={printerInfo.printerCode} />
          </div>
          <div className="lg:col-span-4">
            <OrderStatusChart printerCode={printerInfo.printerCode} />
          </div>
        </div>

        {/* Row 2: Paper & Material Status | Supply Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <PaperMaterialStatus printerCode={printerInfo.printerCode} />
          </div>
          <div className="lg:col-span-5">
            <SupplyStatus printerCode={printerInfo.printerCode} />
          </div>
        </div>
      </div>
    </Page>
  );
}
