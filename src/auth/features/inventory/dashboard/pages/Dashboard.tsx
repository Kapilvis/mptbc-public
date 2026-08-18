import { useMemo } from "react";
import Page from "shared/components/panels/Page";
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

export default function Dashboard() {
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

  return (
    <Page
      header="Central Depot Dashboard"
      subHeader="Centralized inventory management, printer orders distribution, and stock tracking."
      showHeaderActions
    >
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {/* KPI 1 */}
        <Card className="border-l-4 border-l-blue-600 bg-blue-50/20 dark:bg-blue-950/10 p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <i className="pi pi-database text-lg" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">
                Total Stock
              </span>
              <span className="text-xl font-extrabold text-blue-950 dark:text-white">
                {totalStock.toLocaleString()} MT
              </span>
            </div>
          </div>
        </Card>

        {/* KPI 2 */}
        <Card className="border-l-4 border-l-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/10 p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <i className="pi pi-sliders-h text-lg" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">
                Available GSM
              </span>
              <span className="text-xl font-extrabold text-emerald-950 dark:text-white">
                {availableGsmCount} Types
              </span>
            </div>
          </div>
        </Card>

        {/* KPI 3 */}
        <Card className="border-l-4 border-l-amber-600 bg-amber-50/20 dark:bg-amber-950/10 p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
              <i className="pi pi-file-edit text-lg" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">
                Pending Orders
              </span>
              <span className="text-xl font-extrabold text-amber-950 dark:text-white">
                {pendingOrdersCount} Active
              </span>
            </div>
          </div>
        </Card>

        {/* KPI 4 */}
        <Card className="border-l-4 border-l-indigo-650 bg-indigo-50/20 dark:bg-indigo-950/10 p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/40 text-indigo-650 dark:text-indigo-400">
              <i className="pi pi-send text-lg" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">
                Today Issued
              </span>
              <span className="text-xl font-extrabold text-indigo-950 dark:text-white">
                {todayDistribution.toLocaleString()} MT
              </span>
            </div>
          </div>
        </Card>

        {/* KPI 5 */}
        <Card className="border-l-4 border-l-rose-600 bg-rose-50/20 dark:bg-rose-950/10 p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
              <i className="pi pi-exclamation-triangle text-lg" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">
                Low Stock
              </span>
              <span className="text-xl font-extrabold text-rose-950 dark:text-white">
                {lowStockGsmCount} Alert(s)
              </span>
            </div>
          </div>
        </Card>

        {/* KPI 6 */}
        <Card className="border-l-4 border-l-purple-650 bg-purple-50/20 dark:bg-purple-950/10 p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100 dark:bg-purple-900/40 text-purple-650 dark:text-purple-400">
              <i className="pi pi-users text-lg" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wider">
                Printers Active
              </span>
              <span className="text-xl font-extrabold text-purple-950 dark:text-white">
                {printersSuppliedCount} Press(es)
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Side: Stock Summary GridPanel */}
        <Card className="lg:col-span-2 p-5 flex flex-col justify-between">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <i className="pi pi-database text-blue-600" />
                Depot Stock Availability Summary
              </h3>
              <span className="text-[10px] font-bold text-blue-650 bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded-full border border-blue-150 uppercase tracking-wider">
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
                    <span className="text-xs font-bold">{row.gsm} GSM</span>
                  ),
                },
                {
                  field: "paperType",
                  header: "Paper Type",
                  cell: (row: PaperStock) => (
                    <span className="text-xs font-semibold">
                      {row.paperType}
                    </span>
                  ),
                },
                {
                  field: "openingStock",
                  header: "Opening Stock",
                  align: "right",
                  cell: (row: PaperStock) => (
                    <span className="text-xs">
                      {row.openingStock.toLocaleString()} MT
                    </span>
                  ),
                },
                {
                  field: "receivedQuantity",
                  header: "Received",
                  align: "right",
                  cell: (row: PaperStock) => (
                    <span className="text-xs text-emerald-600 font-medium">
                      +{row.receivedQuantity.toLocaleString()} MT
                    </span>
                  ),
                },
                {
                  field: "issuedQuantity",
                  header: "Issued",
                  align: "right",
                  cell: (row: PaperStock) => (
                    <span className="text-xs text-rose-600 font-medium">
                      -{row.issuedQuantity.toLocaleString()} MT
                    </span>
                  ),
                },
                {
                  field: "availableQuantity",
                  header: "Available Stock",
                  align: "right",
                  cell: (row: PaperStock) => (
                    <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400">
                      {row.availableQuantity.toLocaleString()} MT
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </Card>

        {/* Right Side: Low Stock Alerts & Distribution chart */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Low Stock Alerts */}
          <Card className="p-5">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pb-3 mb-4 border-b border-gray-100 dark:border-gray-850 flex items-center gap-2">
              <i className="pi pi-exclamation-triangle text-rose-600" />
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
                      className="p-3 rounded-lg bg-rose-50/30 border border-rose-100 dark:bg-rose-950/5 dark:border-rose-900/30 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold block text-gray-800 dark:text-gray-200">
                          {item.gsm} GSM ({item.paperType})
                        </span>
                        <span className="text-[10px] text-rose-600 font-medium">
                          Min Level: {item.minimumStockLevel.toLocaleString()}{" "}
                          MT
                        </span>
                      </div>
                      <span className="font-extrabold text-rose-600">
                        {item.availableQuantity.toLocaleString()} MT
                      </span>
                    </div>
                  ))
              )}
            </div>
          </Card>

          {/* Simple Distribution Chart (No inline style) */}
          <Card className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 pb-3 mb-4 border-b border-gray-100 dark:border-gray-850 flex items-center gap-2">
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
                          className={`w-full bg-linear-to-t from-indigo-650 to-indigo-500 rounded-t-md transition-all duration-300 group-hover:from-indigo-700 group-hover:to-indigo-550 ${getHeightClass(percentageHeight)}`}
                        />
                        {/* Tooltip */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-md pointer-events-none z-10">
                          {data.qty.toLocaleString()} MT
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
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
      <Card className="p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <i className="pi pi-send text-purple-650" />
            Recent Paper Distribution Shipments
          </h3>
          <span className="text-xs text-gray-400">
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
                <span className="text-xs font-bold text-indigo-950 dark:text-white">
                  {row.challanNo}
                </span>
              ),
            },
            {
              field: "distributionDate",
              header: "Dispatch Date",
              cell: (row: PaperDistribution) => (
                <span className="text-xs">{row.distributionDate}</span>
              ),
            },
            {
              field: "printer",
              header: "Printer Name",
              cell: (row: PaperDistribution) => (
                <span className="text-xs font-semibold">{row.printer}</span>
              ),
            },
            {
              field: "gsm",
              header: "GSM",
              align: "center",
              cell: (row: PaperDistribution) => (
                <span className="text-xs font-bold">{row.gsm} GSM</span>
              ),
            },
            {
              field: "issueQuantity",
              header: "Quantity Issued",
              align: "right",
              cell: (row: PaperDistribution) => (
                <span className="text-xs text-emerald-600 font-extrabold">
                  {row.issueQuantity.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "vehicleNo",
              header: "Vehicle No",
              cell: (row: PaperDistribution) => (
                <span className="text-xs font-mono">{row.vehicleNo}</span>
              ),
            },
            {
              field: "status",
              header: "Status",
              align: "center",
              cell: (row: PaperDistribution) => (
                <span className="px-2 py-0.5 rounded-full font-bold text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 uppercase tracking-wider">
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
