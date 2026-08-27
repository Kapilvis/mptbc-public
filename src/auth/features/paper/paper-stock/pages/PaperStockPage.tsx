import { useMemo } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { dataManager } from "../../../inventory/mockData";
import type { PaperStock } from "../../../inventory/types";

export function StockStatusBadge({
  status,
}: {
  status: PaperStock["stockStatus"];
}) {
  const cls = {
    "In Stock":
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50",
    "Low Stock":
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
    "Out of Stock":
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
  }[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${cls}`}
    >
      {status}
    </span>
  );
}

export default function PaperStockPage() {
  const pageTitle = usePageTitle();
  const stocks = dataManager.getStocks();

  const totals = useMemo(() => {
    return stocks.reduce(
      (acc, curr) => {
        acc.openingStock += curr.openingStock;
        acc.receivedQuantity += curr.receivedQuantity;
        acc.issuedQuantity += curr.issuedQuantity;
        acc.availableQuantity += curr.availableQuantity;
        return acc;
      },
      {
        openingStock: 0,
        receivedQuantity: 0,
        issuedQuantity: 0,
        availableQuantity: 0,
      },
    );
  }, [stocks]);

  const kpiCards = [
    {
      label: "Opening Stock",
      value: `${totals.openingStock.toLocaleString()} MT`,
      subLabel: "Godown Starting Balance",
      icon: "pi-box",
      accent: "border-l-amber-500",
      iconBg:
        "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50",
      subColor: "text-amber-600",
    },
    {
      label: "Total Received Paper",
      value: `${totals.receivedQuantity.toLocaleString()} MT`,
      subLabel: "Receipts from Paper Mills",
      icon: "pi-truck",
      accent: "border-l-emerald-600",
      iconBg:
        "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50",
      subColor: "text-emerald-600",
    },
    {
      label: "Total Issued to Printers",
      value: `${totals.issuedQuantity.toLocaleString()} MT`,
      subLabel: "Dispatched to Registered Presses",
      icon: "pi-send",
      accent: "border-l-blue-600",
      iconBg:
        "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50",
      subColor: "text-blue-600",
    },
    {
      label: "Available Depot Stock",
      value: `${totals.availableQuantity.toLocaleString()} MT`,
      subLabel: "Opening + Received − Issued",
      icon: "pi-check-circle",
      accent: "border-l-purple-600",
      iconBg:
        "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/50",
      subColor: "text-purple-600",
    },
  ];

  return (
    <Page
      header={pageTitle || "Paper Stock Management"}
      subHeader="कागज स्टॉक प्रबंधन — Monitor available stock levels, reel specifications, and minimum thresholds."
      showHeaderActions
    >
      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {kpiCards.map((kpi) => (
          <Card
            key={kpi.label}
            className={`border-l-4 ${kpi.accent} border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow`}
          >
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  {kpi.label}
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {kpi.value}
                </div>
                <div
                  className={`mt-1 flex items-center gap-1.5 text-xs ${kpi.subColor} font-semibold`}
                >
                  <i className={`pi ${kpi.icon} text-[11px]`} />
                  <span>{kpi.subLabel}</span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${kpi.iconBg}`}
              >
                <i className={`pi ${kpi.icon} text-xl`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Grid List */}
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={stocks}
          searchFields={["gsm", "paperType", "sheetSize"]}
          exportFilename="Central_Depot_Paper_Stock"
          columns={[
            {
              cell: (_, option) => (
                <span className="text-sm">{option.rowIndex + 1}</span>
              ),
              width: "50px",
              align: "center",
            },
            {
              field: "gsm",
              header: "GSM",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-sm font-semibold">{row.gsm} GSM</span>
              ),
            },
            {
              field: "paperType",
              header: "Paper Type",
              cell: (row: PaperStock) => (
                <span className="text-sm">{row.paperType}</span>
              ),
            },
            {
              field: "sheetSize",
              header: "Sheet Size (cm)",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-sm">{row.sheetSize}</span>
              ),
            },
            {
              field: "reelWidth",
              header: "Reel Width (mm)",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-sm">{row.reelWidth}</span>
              ),
            },
            {
              field: "cutoff",
              header: "Cutoff (mm)",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-sm">{row.cutoff}</span>
              ),
              footer: (
                <span className="font-bold text-slate-700 uppercase tracking-wide text-xs">
                  Total Stock
                </span>
              ),
            },
            {
              field: "openingStock",
              header: "Opening Stock",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-sm">
                  {row.openingStock.toLocaleString()} MT
                </span>
              ),
              footer: (
                <span className="font-bold text-slate-700 text-sm">
                  {totals.openingStock.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "receivedQuantity",
              header: "Received Paper",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-sm text-emerald-600 font-medium">
                  +{row.receivedQuantity.toLocaleString()} MT
                </span>
              ),
              footer: (
                <span className="font-bold text-emerald-600 text-sm">
                  {totals.receivedQuantity.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "issuedQuantity",
              header: "Paper Issued",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-sm text-rose-600 font-medium">
                  -{row.issuedQuantity.toLocaleString()} MT
                </span>
              ),
              footer: (
                <span className="font-bold text-rose-600 text-sm">
                  {totals.issuedQuantity.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "availableQuantity",
              header: "Available Stock",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                  {row.availableQuantity.toLocaleString()} MT
                </span>
              ),
              footer: (
                <span className="font-bold text-blue-700 dark:text-blue-400 text-sm">
                  {totals.availableQuantity.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "stockStatus",
              header: "Stock Status",
              align: "center",
              cell: (row: PaperStock) => (
                <StockStatusBadge status={row.stockStatus} />
              ),
            },
            {
              field: "lastUpdated",
              header: "Last Updated",
              cell: (row: PaperStock) => (
                <span className="text-sm text-gray-500">{row.lastUpdated}</span>
              ),
            },
          ]}
        />
      </Card>
    </Page>
  );
}
