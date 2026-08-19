import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel, InputPanel } from "shared/components/panels";
import { DropDownList } from "shared/components/forms";
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
  const [gsmFilter, setGsmFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const stocks = dataManager.getStocks();

  const filteredData = useMemo(() => {
    return stocks.filter((s) => {
      const matchGsm = !gsmFilter || s.gsm.toString() === gsmFilter;
      const matchType = !typeFilter || s.paperType === typeFilter;
      const matchStatus = !statusFilter || s.stockStatus === statusFilter;
      return matchGsm && matchType && matchStatus;
    });
  }, [stocks, gsmFilter, typeFilter, statusFilter]);

  const gsmOptions = useMemo(() => {
    const uniqueGsms = Array.from(new Set(stocks.map((s) => s.gsm)));
    return uniqueGsms.map((gsm) => ({
      text: `${gsm} GSM`,
      value: gsm.toString(),
    }));
  }, [stocks]);

  const typeOptions = useMemo(() => {
    const uniqueTypes = Array.from(new Set(stocks.map((s) => s.paperType)));
    return uniqueTypes.map((t) => ({ text: t, value: t }));
  }, [stocks]);

  const statusOptions = [
    { text: "In Stock", value: "In Stock" },
    { text: "Low Stock", value: "Low Stock" },
    { text: "Out of Stock", value: "Out of Stock" },
  ];

  return (
    <Page
      header={pageTitle || "Paper Stock Management"}
      subHeader="कागज स्टॉक प्रबंधन — Monitor available stock levels, reel specifications, and minimum thresholds."
      showHeaderActions
    >
      {/* Filters Bar */}
      <Card className="mb-4 p-4">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-150/40">
          <i className="pi pi-filter text-blue-600 font-bold" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
            Filter Stock Options
          </span>
        </div>
        <InputPanel orientation="horizontal" className="grid-3">
          <DropDownList
            label="GSM Size"
            data={gsmOptions}
            textField="text"
            valueField="value"
            value={gsmFilter}
            onChange={(val) => setGsmFilter(val as string)}
            defaultOptionText="All GSMs"
          />

          <DropDownList
            label="Paper Type"
            data={typeOptions}
            textField="text"
            valueField="value"
            value={typeFilter}
            onChange={(val) => setTypeFilter(val as string)}
            defaultOptionText="All Types"
          />

          <DropDownList
            label="Stock Status"
            data={statusOptions}
            textField="text"
            valueField="value"
            value={statusFilter}
            onChange={(val) => setStatusFilter(val as string)}
            defaultOptionText="All Statuses"
          />
        </InputPanel>
      </Card>

      {/* Grid List */}
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={filteredData}
          searchFields={["gsm", "paperType", "sheetSize"]}
          exportFilename="Central_Depot_Paper_Stock"
          columns={[
            {
              cell: (_, option) => (
                <span className="text-xs">{option.rowIndex + 1}</span>
              ),
              width: "50px",
              align: "center",
            },
            {
              field: "gsm",
              header: "GSM",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-xs font-semibold">{row.gsm} GSM</span>
              ),
            },
            {
              field: "paperType",
              header: "Paper Type",
              cell: (row: PaperStock) => (
                <span className="text-xs">{row.paperType}</span>
              ),
            },
            {
              field: "sheetSize",
              header: "Sheet Size (cm)",
              cell: (row: PaperStock) => (
                <span className="text-xs">{row.sheetSize}</span>
              ),
            },
            {
              field: "reelWidth",
              header: "Reel Width (mm)",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-xs">{row.reelWidth}</span>
              ),
            },
            {
              field: "cutoff",
              header: "Cutoff (mm)",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-xs">{row.cutoff}</span>
              ),
            },
            {
              field: "openingStock",
              header: "Opening Stock",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-xs">
                  {row.openingStock.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "receivedQuantity",
              header: "Received Qty",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-xs text-emerald-600 font-medium">
                  +{row.receivedQuantity.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "issuedQuantity",
              header: "Issued Qty",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-xs text-rose-600 font-medium">
                  -{row.issuedQuantity.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "availableQuantity",
              header: "Available Stock",
              align: "center",
              cell: (row: PaperStock) => (
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                  {row.availableQuantity.toLocaleString()} MT
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
                <span className="text-xs text-gray-500">{row.lastUpdated}</span>
              ),
            },
          ]}
        />
      </Card>
    </Page>
  );
}
