import { useEffect, useState } from "react";
import Page from "shared/components/panels/Page";
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
  UpcomingDeadlines,
  MonthlyPrintingChart,
  PaperMaterialStatus,
  SupplyStatus,
  RecentPrinterOrders,
  PrinterAlerts,
} from "./components";

export default function PrinterDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);

  // Resolve logged-in user to their printer profile details
  const printerInfo = resolvePrinterDetails(
    user?.profile?.name || "PRINTER ADMIN",
  );
  const stats = getPrinterDashboardStats(printerInfo.printerCode);

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
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
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
    <Page>
      <div className="space-y-6">
        {/* 8 Metric Cards Grid */}
        <PrinterKpiCards stats={stats} />

        {/* Row 1: Printing Progress | Order Status Overview | Upcoming Deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6">
            <PrintingProgress printerCode={printerInfo.printerCode} />
          </div>
          <div className="lg:col-span-3">
            <OrderStatusChart printerCode={printerInfo.printerCode} />
          </div>
          <div className="lg:col-span-3">
            <UpcomingDeadlines printerCode={printerInfo.printerCode} />
          </div>
        </div>

        {/* Row 2: Monthly Printing Performance | Paper & Material Status | Supply Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <MonthlyPrintingChart printerCode={printerInfo.printerCode} />
          </div>
          <div className="lg:col-span-5">
            <PaperMaterialStatus printerCode={printerInfo.printerCode} />
          </div>
          <div className="lg:col-span-4">
            <SupplyStatus printerCode={printerInfo.printerCode} />
          </div>
        </div>

        {/* Row 3: Recent Printer Orders | Alerts & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <RecentPrinterOrders printerCode={printerInfo.printerCode} />
          </div>
          <div className="lg:col-span-4">
            <PrinterAlerts printerCode={printerInfo.printerCode} />
          </div>
        </div>
      </div>
    </Page>
  );
}
