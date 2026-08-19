import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import { Card, GridPanel } from "shared/components/panels";
import { dataManager } from "../../mockData";
import type { PaperStock, PrinterOrder, PaperDistribution } from "../../types";

const getHeightClass = (percentage: number) => {
  if (percentage <= 10) return "h-[10%]";
  if (percentage <= 20) return "h-[20%]";
  if (percentage <= 30) return "h-[30%]";
  if (percentage <= 40) return "h-[40%]";
  if (percentage <= 50) return "h-[50%]";
  if (percentage <= 60) return "h-[60%]";
  if (percentage <= 70) return "h-[70%]";
  if (percentage <= 80) return "h-[80%]";
  if (percentage <= 90) return "h-[90%]";
  return "h-full";
};

const THEMES: Record<
  string,
  {
    cardClass: string;
    badgeClass: string;
    titleClass: string;
    valueClass: string;
    watermarkClass: string;
    glossClass: string;
  }
> = {
  blue: {
    cardClass:
      "bg-gradient-to-br from-blue-50/90 to-blue-100/40 dark:from-blue-950/40 dark:to-blue-900/10 border-blue-200/70 dark:border-blue-900/40 hover:shadow-blue-200/50 dark:hover:shadow-blue-950/20",
    badgeClass:
      "bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/25 dark:from-blue-950/80 dark:to-blue-900/60 dark:text-blue-400 border border-blue-400/20",
    titleClass: "text-slate-700 dark:text-slate-200 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    watermarkClass: "text-blue-500 dark:text-blue-400",
    glossClass: "via-blue-300/30 dark:via-blue-500/10",
  },
  green: {
    cardClass:
      "bg-gradient-to-br from-emerald-50/90 to-emerald-100/40 dark:from-emerald-950/40 dark:to-emerald-900/10 border-emerald-200/70 dark:border-emerald-900/40 hover:shadow-emerald-200/50 dark:hover:shadow-emerald-950/20",
    badgeClass:
      "bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/25 dark:from-emerald-950/80 dark:to-emerald-900/60 dark:text-emerald-400 border border-emerald-400/20",
    titleClass: "text-slate-700 dark:text-slate-200 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    watermarkClass: "text-emerald-500 dark:text-emerald-400",
    glossClass: "via-emerald-300/30 dark:via-emerald-500/10",
  },
  yellow: {
    cardClass:
      "bg-gradient-to-br from-amber-50/90 to-amber-100/40 dark:from-amber-950/40 dark:to-amber-900/10 border-amber-250/60 dark:border-amber-900/40 hover:shadow-amber-200/50 dark:hover:shadow-amber-950/20",
    badgeClass:
      "bg-gradient-to-tr from-amber-600 to-amber-500 text-white shadow-md shadow-amber-500/25 dark:from-amber-950/80 dark:to-amber-900/60 dark:text-amber-400 border border-amber-400/20",
    titleClass: "text-slate-700 dark:text-slate-200 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    watermarkClass: "text-amber-500 dark:text-amber-400",
    glossClass: "via-amber-300/30 dark:via-amber-500/10",
  },
  indigo: {
    cardClass:
      "bg-gradient-to-br from-indigo-50/90 to-indigo-100/40 dark:from-indigo-950/40 dark:to-indigo-900/10 border-indigo-200/70 dark:border-indigo-900/40 hover:shadow-indigo-200/50 dark:hover:shadow-indigo-950/20",
    badgeClass:
      "bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25 dark:from-indigo-950/80 dark:to-indigo-900/60 dark:text-indigo-400 border border-indigo-400/20",
    titleClass: "text-slate-700 dark:text-slate-200 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    watermarkClass: "text-indigo-500 dark:text-indigo-400",
    glossClass: "via-indigo-300/30 dark:via-indigo-500/10",
  },
  red: {
    cardClass:
      "bg-gradient-to-br from-rose-50/90 to-rose-100/40 dark:from-rose-950/40 dark:to-rose-900/10 border-rose-200/70 dark:border-rose-900/40 hover:shadow-rose-200/50 dark:hover:shadow-rose-950/20",
    badgeClass:
      "bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-md shadow-rose-500/25 dark:from-rose-950/80 dark:to-rose-900/60 dark:text-rose-400 border border-rose-400/20",
    titleClass: "text-slate-700 dark:text-slate-200 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    watermarkClass: "text-rose-500 dark:text-rose-400",
    glossClass: "via-rose-300/30 dark:via-rose-500/10",
  },
  purple: {
    cardClass:
      "bg-gradient-to-br from-purple-50/90 to-purple-100/40 dark:from-purple-950/40 dark:to-purple-900/10 border-purple-200/70 dark:border-purple-900/40 hover:shadow-purple-200/50 dark:hover:shadow-purple-950/20",
    badgeClass:
      "bg-gradient-to-tr from-purple-600 to-purple-500 text-white shadow-md shadow-purple-500/25 dark:from-purple-950/80 dark:to-purple-900/60 dark:text-purple-400 border border-purple-400/20",
    titleClass: "text-slate-700 dark:text-slate-200 font-extrabold",
    valueClass: "text-slate-900 dark:text-white font-black",
    watermarkClass: "text-purple-500 dark:text-purple-400",
    glossClass: "via-purple-300/30 dark:via-purple-500/10",
  },
};

export default function Dashboard() {
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const stocks = dataManager.getStocks();
  const orders = dataManager.getOrders();
  const distributions = dataManager.getDistributions();

  // 1. Total Paper Stock
  const totalStock = useMemo(() => {
    return stocks.reduce(
      (sum: number, s: PaperStock) => sum + s.availableQuantity,
      0,
    );
  }, [stocks]);

  // 2. Available GSM Types
  const availableGsmCount = useMemo(() => {
    return stocks.filter((s: PaperStock) => s.availableQuantity > 0).length;
  }, [stocks]);

  // 3. Pending Printer Orders
  const pendingOrdersCount = useMemo(() => {
    return orders.filter(
      (o: PrinterOrder) =>
        o.status === "Pending" || o.status === "Partially Supplied",
    ).length;
  }, [orders]);

  // 4. Today's Distribution (Using "2026-08-17" as reference date or local today)
  const todayDistribution = useMemo(() => {
    const todayStr = "2026-08-17"; // Static reference date for mock consistency
    return distributions
      .filter((d: PaperDistribution) => d.distributionDate === todayStr)
      .reduce((sum: number, d: PaperDistribution) => sum + d.issueQuantity, 0);
  }, [distributions]);

  // 5. Low Stock GSMs
  const lowStockGsmCount = useMemo(() => {
    return stocks.filter(
      (s: PaperStock) => s.availableQuantity <= s.minimumStockLevel,
    ).length;
  }, [stocks]);

  // 6. Total Printers Supplied
  const printersSuppliedCount = useMemo(() => {
    const uniquePrinters = new Set(
      distributions.map((d: PaperDistribution) => d.printer),
    );
    return uniquePrinters.size;
  }, [distributions]);

  // Mock Months Data for distribution chart
  const monthlyData = [
    { month: "April", qty: 4500 },
    { month: "May", qty: 5200 },
    { month: "June", qty: 6800 },
    { month: "July", qty: 7900 },
    { month: "August", qty: 6250 },
  ];

  const kpis = [
    {
      title: "Total Paper Stock",
      value: `${totalStock.toLocaleString("en-IN")} MT`,
      icon: "pi pi-database",
      themeKey: "blue",
    },
    {
      title: "Available GSM",
      value: `${availableGsmCount} Types`,
      icon: "pi pi-sliders-h",
      themeKey: "green",
    },
    {
      title: "Pending Orders",
      value: `${pendingOrdersCount} Orders`,
      icon: "pi pi-file-edit",
      themeKey: "yellow",
    },
    {
      title: "Today Issued",
      value: `${todayDistribution.toLocaleString("en-IN")} MT`,
      icon: "pi pi-send",
      themeKey: "indigo",
    },
    {
      title: "Low Stock Alerts",
      value: `${lowStockGsmCount} Alerts`,
      icon: "pi pi-exclamation-triangle",
      themeKey: "red",
    },
    {
      title: "Printers Active",
      value: `${printersSuppliedCount} Printers`,
      icon: "pi pi-users",
      themeKey: "purple",
    },
  ];

  return (
    <Page
      header="Central Depot Dashboard"
      subHeader="Centralized inventory management, printer orders distribution, and stock tracking."
      showHeaderActions
    >
      {/* Academic Year Filter Bar */}
      <AcademicYearFilterBar
        academicYear={academicYear}
        onChange={setAcademicYear}
        subtitle=""
      />

      {/* KPI Section - Upgraded with premium custom themes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {kpis.map((kpi, idx) => {
          const theme = THEMES[kpi.themeKey] || THEMES.blue;
          return (
            <div
              key={idx}
              className={`group relative overflow-hidden rounded-2xl p-4.5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl border ${theme.cardClass}`}
            >
              {/* Glassmorphic Top Highlight Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent ${theme.glossClass} to-transparent z-10`}
              />

              {/* Background Watermark Icon */}
              <i
                className={`${kpi.icon} absolute -bottom-5 -right-5 text-7xl opacity-[0.05] dark:opacity-[0.03] pointer-events-none transition-all duration-700 ease-out group-hover:rotate-12 group-hover:scale-125 ${theme.watermarkClass}`}
                aria-hidden="true"
              />

              <div className="flex items-center gap-3.5 relative z-10">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${theme.badgeClass}`}
                >
                  <i className={`${kpi.icon} text-base`} />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wider block truncate ${theme.titleClass}`}
                  >
                    {kpi.title}
                  </span>
                  <span
                    className={`text-[19px] block mt-0.5 font-mono truncate ${theme.valueClass}`}
                    title={kpi.value}
                  >
                    {kpi.value}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Side: Stock Summary GridPanel */}
        <Card className="lg:col-span-2 p-5 flex flex-col justify-between border-t-transparent! relative overflow-hidden transition-all duration-300 hover:shadow-md">
          {/* Premium top gradient border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-600 z-20" />

          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <i className="pi pi-database text-[#4F8F70]" />
                Depot Stock Availability Summary
              </h3>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                Real-time
              </span>
            </div>

            <GridPanel
              data={stocks}
              searchBox={false}
              showExport={false}
              columns={[
                {
                  field: "gsm",
                  header: "GSM",
                  align: "center",
                  cell: (row: PaperStock) => (
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {row.gsm} GSM
                    </span>
                  ),
                },
                {
                  field: "paperType",
                  header: "Paper Type",
                  cell: (row: PaperStock) => (
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {row.paperType}
                    </span>
                  ),
                },
                {
                  field: "openingStock",
                  header: "Total Stock",
                  align: "center",
                  cell: (row: PaperStock) => (
                    <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-slate-200">
                      {row.openingStock.toLocaleString("en-IN")} MT
                    </span>
                  ),
                },
                {
                  field: "receivedQuantity",
                  header: "Received",
                  align: "center",
                  cell: (row: PaperStock) => (
                    <span className="text-sm font-black font-mono text-emerald-650 dark:text-emerald-450">
                      +{row.receivedQuantity.toLocaleString("en-IN")} MT
                    </span>
                  ),
                },
                {
                  field: "issuedQuantity",
                  header: "Issued",
                  align: "center",
                  cell: (row: PaperStock) => (
                    <span className="text-sm font-black font-mono text-rose-650 dark:text-rose-405">
                      -{row.issuedQuantity.toLocaleString("en-IN")} MT
                    </span>
                  ),
                },
                {
                  field: "availableQuantity",
                  header: "Available Stock",
                  align: "center",
                  cell: (row: PaperStock) => (
                    <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
                      {row.availableQuantity.toLocaleString("en-IN")} MT
                    </span>
                  ),
                },
                {
                  field: "dailyConsumption",
                  header: "Daily Usage (Avg)",
                  align: "center",
                  cell: (row: PaperStock) => (
                    <span className="text-sm font-extrabold font-mono text-slate-900 dark:text-slate-200">
                      {row.dailyConsumption
                        ? `${row.dailyConsumption.toLocaleString("en-IN")} MT`
                        : "-"}
                    </span>
                  ),
                },
                {
                  field: "daysOfStock",
                  header: "Days of Stock",
                  align: "center",
                  cell: (row: PaperStock) => {
                    const days = row.daysOfStock ?? 0;
                    const isLow = days <= 2.5;
                    return (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider inline-block ${
                          isLow
                            ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50"
                        }`}
                      >
                        {days} Days
                      </span>
                    );
                  },
                },
              ]}
            />
          </div>
        </Card>

        {/* Right Side: Low Stock Alerts & Distribution chart */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Low Stock Alerts */}
          <Card className="p-5 border-t-transparent! relative overflow-hidden transition-all duration-300 hover:shadow-md">
            {/* Premium top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-600 z-20" />

            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 mb-4 border-b border-gray-100 dark:border-gray-855 flex items-center gap-2">
              <i className="pi pi-exclamation-triangle text-rose-600 animate-pulse" />
              Low Stock Alerts
            </h3>
            <div className="flex flex-col gap-3">
              {stocks.filter(
                (s: PaperStock) => s.availableQuantity <= s.minimumStockLevel,
              ).length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 italic">
                  All GSM stock levels are healthy!
                </div>
              ) : (
                stocks
                  .filter(
                    (s: PaperStock) =>
                      s.availableQuantity <= s.minimumStockLevel,
                  )
                  .map((item: PaperStock, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3.5 p-3.5 bg-linear-to-r from-red-50 to-rose-50/20 dark:from-red-950/20 dark:to-transparent border border-red-200/50 dark:border-red-900/30 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                    >
                      {/* Pulsing Alert Icon Badge */}
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-100 dark:bg-red-900/40 text-rose-600 dark:text-red-400 shrink-0">
                        <i className="pi pi-exclamation-triangle text-base animate-pulse" />
                      </div>

                      {/* Info Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {item.gsm} GSM ({item.paperType})
                          </span>
                          <span className="font-black text-sm text-rose-600 dark:text-red-400 font-mono">
                            {item.availableQuantity.toLocaleString("en-IN")} MT
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-1 mt-1 text-[11px]">
                          <span className="text-slate-500 dark:text-slate-400 font-semibold">
                            Min Level:{" "}
                            <span className="font-extrabold text-slate-700 dark:text-slate-300">
                              {item.minimumStockLevel.toLocaleString("en-IN")}{" "}
                              MT
                            </span>
                          </span>
                          <span className="text-amber-600 dark:text-amber-500 font-black flex items-center gap-1">
                            <i className="pi pi-clock text-[9px]" />
                            {item.daysOfStock} Days Remaining
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </Card>

          {/* Simple Distribution Chart */}
          <Card className="p-5 flex-1 flex flex-col justify-between border-t-transparent! relative overflow-hidden transition-all duration-300 hover:shadow-md">
            {/* Premium top gradient border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-600 z-20" />

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-3 mb-4 border-b border-gray-100 dark:border-gray-855 flex items-center gap-2">
                <i className="pi pi-chart-bar text-indigo-600" />
                Monthly Paper Distribution Trend
              </h3>
              <div className="flex items-end justify-between h-28 pt-4 px-2">
                {monthlyData.map((data, idx) => {
                  const maxVal = Math.max(...monthlyData.map((d) => d.qty));
                  const percentageHeight = (data.qty / maxVal) * 100;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-2 w-full group"
                    >
                      <div className="relative w-7 bg-indigo-50 dark:bg-gray-800 rounded-t-md h-20 flex items-end">
                        <div
                          className={`w-full bg-linear-to-t from-indigo-600 via-indigo-500 to-indigo-400 rounded-t-md transition-all duration-305 group-hover:from-indigo-700 group-hover:to-indigo-550 ${getHeightClass(percentageHeight)}`}
                        />
                        {/* Tooltip */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md pointer-events-none z-10">
                          {data.qty.toLocaleString("en-IN")} MT
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-700 dark:text-slate-350 font-black uppercase tracking-wider">
                        {data.month.slice(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Grid: Recent Distributions GridPanel */}
      <Card className="p-5 border-t-transparent! relative overflow-hidden transition-all duration-300 hover:shadow-md">
        {/* Premium top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-600 z-20" />

        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i className="pi pi-send text-purple-650" />
            Recent Paper Distribution Shipments
          </h3>
          <span className="text-xs text-slate-500 font-extrabold">
            Showing last 5 dispatches
          </span>
        </div>

        <GridPanel
          data={distributions.slice(-5).reverse()}
          searchBox={false}
          showExport={false}
          columns={[
            {
              field: "challanNo",
              header: "Challan / Dist No",
              cell: (row: PaperDistribution) => (
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {row.challanNo}
                </span>
              ),
            },
            {
              field: "distributionDate",
              header: "Dispatch Date",
              cell: (row: PaperDistribution) => (
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {row.distributionDate}
                </span>
              ),
            },
            {
              field: "printer",
              header: "Printer Name",
              cell: (row: PaperDistribution) => (
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {row.printer}
                </span>
              ),
            },
            {
              field: "gsm",
              header: "GSM",
              align: "center",
              cell: (row: PaperDistribution) => (
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {row.gsm} GSM
                </span>
              ),
            },
            {
              field: "issueQuantity",
              header: "Quantity Issued",
              align: "center",
              cell: (row: PaperDistribution) => (
                <span className="text-sm text-emerald-650 font-black font-mono">
                  {row.issueQuantity.toLocaleString("en-IN")} MT
                </span>
              ),
            },
            {
              field: "vehicleNo",
              header: "Vehicle No",
              cell: (row: PaperDistribution) => (
                <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-300">
                  {row.vehicleNo}
                </span>
              ),
            },
            {
              field: "status",
              header: "Status",
              align: "center",
              cell: (row: PaperDistribution) => (
                <span className="px-2.5 py-0.5 rounded-full font-extrabold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 uppercase tracking-wider">
                  {row.status}
                </span>
              ),
            },
          ]}
        />
      </Card>
    </Page>
  );
}
