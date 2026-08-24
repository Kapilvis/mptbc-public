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

  return (
    <Page
      header={pageTitle || "Paper Stock Management"}
      subHeader="कागज स्टॉक प्रबंधन — Monitor available stock levels, reel specifications, and minimum thresholds."
      showHeaderActions
    >
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
