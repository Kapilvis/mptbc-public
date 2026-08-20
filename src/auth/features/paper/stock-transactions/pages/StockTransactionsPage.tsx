import { useState } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { dataManager } from "../../../inventory/mockData";
import type { StockTransaction } from "../../../inventory/types";
import { Calendar } from "primereact/calendar";

// Badge component for transaction type
function TransactionTypeBadge({ type }: { type: StockTransaction["type"] }) {
  const cls =
    {
      Opening:
        "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
      Receipt:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50",
      Distribution:
        "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
      "ISSUE TO PRINTER":
        "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
      Adjustment:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
      Return:
        "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50",
    }[type] || "bg-gray-50 text-gray-700 border-gray-200";

  const displayVal = type === "Receipt" ? "Received" : type;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${cls}`}
    >
      {displayVal}
    </span>
  );
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }
  return dateStr;
};

export default function StockTransactionsPage() {
  const pageTitle = usePageTitle();
  const rawTransactions = dataManager.getTransactions();
  const stocks = dataManager.getStocks();

  const [selectedGsm, setSelectedGsm] = useState<number | "All">("All");
  const [activeTab, setActiveTab] = useState<"ledger" | "transactions">(
    "transactions",
  );

  const [dateFilterMode, setDateFilterMode] = useState<
    "all" | "single" | "range"
  >("all");
  const [singleDate, setSingleDate] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const gsmOptions = [58, 60, 70, 80];

  // Helper to dynamically calculate running balance chronologically
  const computeBalancesForList = (txs: StockTransaction[]) => {
    const gsmBalances: Record<number, number> = {};

    // Sort chronologically (date, then ID/index)
    const sorted = [...txs].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.id - b.id;
    });

    return sorted.map((t) => {
      const currentGsm = t.gsm;
      if (t.type === "Opening") {
        gsmBalances[currentGsm] = t.quantity;
      } else {
        gsmBalances[currentGsm] = (gsmBalances[currentGsm] || 0) + t.quantity;
      }
      return {
        ...t,
        calculatedBalance: gsmBalances[currentGsm],
      };
    });
  };

  // 1. Process all transactions to get correct individual GSM-wise running balances
  const allTxsWithBalances = computeBalancesForList(rawTransactions);

  // 2. Filter out "Opening" type transactions from the visible tables (as requested)
  const txsWithoutOpening = allTxsWithBalances.filter(
    (t) => t.type !== "Opening",
  );

  // 3. Filter transactions based on selected GSM and Date filter
  const filteredTxs = txsWithoutOpening.filter((t) => {
    // GSM filter
    if (selectedGsm !== "All" && t.gsm !== selectedGsm) {
      return false;
    }
    // Date filter
    if (dateFilterMode === "single" && singleDate) {
      return t.date === singleDate;
    }
    if (dateFilterMode === "range") {
      if (fromDate && t.date < fromDate) return false;
      if (toDate && t.date > toDate) return false;
    }
    return true;
  });

  // 4. For the transactions tab, display reverse chronological list (latest first)
  const displayTxs =
    activeTab === "transactions" ? [...filteredTxs].reverse() : filteredTxs;

  // Dynamic calculations for KPI summary cards based on selected GSM and Date filter
  const gsmRawTxs = allTxsWithBalances.filter(
    (t) => selectedGsm === "All" || t.gsm === selectedGsm,
  );

  const gsmDateFilteredTxs = gsmRawTxs.filter((t) => {
    if (t.type === "Opening") return false;
    if (dateFilterMode === "single" && singleDate) {
      return t.date === singleDate;
    }
    if (dateFilterMode === "range") {
      if (fromDate && t.date < fromDate) return false;
      if (toDate && t.date > toDate) return false;
    }
    return true;
  });

  const kpiOpening = gsmRawTxs
    .filter((t) => t.type === "Opening")
    .reduce((sum, t) => sum + t.quantity, 0);

  const kpiReceived = gsmDateFilteredTxs
    .filter((t) => t.type === "Receipt")
    .reduce((sum, t) => sum + t.quantity, 0);

  const kpiIssued = gsmDateFilteredTxs
    .filter((t) => t.type === "Distribution" || t.type === "ISSUE TO PRINTER")
    .reduce((sum, t) => sum + Math.abs(t.quantity), 0);

  const kpiAvailable = kpiOpening + kpiReceived - kpiIssued;

  return (
    <Page
      header={pageTitle || "Stock Summary "}
      subHeader="कागज स्टॉक खाता और लेनदेन विवरण — Unified view of stock ledger and transaction history logs filtered by paper GSM."
      showHeaderActions
    >
      {/* GSM Selection Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGsm("All")}
            className={`px-4 py-2 rounded-lg border font-semibold text-sm transition-all duration-200 ${
              selectedGsm === "All"
                ? "bg-primary text-white border-primary shadow-md shadow-primary/10"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
            }`}
          >
            All GSMs
          </button>
          {gsmOptions.map((gsm) => {
            const isSelected = selectedGsm === gsm;
            return (
              <button
                key={gsm}
                onClick={() => setSelectedGsm(gsm)}
                className={`px-4 py-2 rounded-lg border font-semibold text-sm transition-all duration-200 ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-md shadow-primary/10"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                }`}
              >
                {gsm} GSM
              </button>
            );
          })}
        </div>

        {selectedGsm === "All" && (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900/30 flex items-center gap-1.5">
            <i className="pi pi-info-circle" />
            Showing consolidated logs.
          </span>
        )}
      </div>

      {/* Stock Summary Cards styled like Admin Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total Stock / Opening */}
        <Card className="relative overflow-hidden border bg-blue-50/70 dark:bg-blue-950/20 border-blue-100/90 dark:border-blue-900/40 transition-all duration-200 hover:shadow-md border-t-transparent!">
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 block truncate">
                1. TOTAL STOCK
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                Opening Balance
              </span>
            </div>
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {kpiOpening.toLocaleString()} MT
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-600 text-white dark:bg-blue-500 shadow-xs">
                <i className="pi pi-home text-lg" />
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Received Stock */}
        <Card className="relative overflow-hidden border bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-100/90 dark:border-emerald-900/40 transition-all duration-200 hover:shadow-md border-t-transparent!">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 block truncate">
                2. RECEIVED STOCK
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                Vendor Logs
              </span>
            </div>
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {kpiReceived.toLocaleString()} MT
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-600 text-white dark:bg-emerald-500 shadow-xs">
                <i className="pi pi-plus-circle text-lg" />
              </div>
            </div>
          </div>
        </Card>

        {/* Card 3: Issued Stock */}
        <Card className="relative overflow-hidden border bg-rose-50/70 dark:bg-rose-950/20 border-rose-100/90 dark:border-rose-900/40 transition-all duration-200 hover:shadow-md border-t-transparent!">
          <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 block truncate">
                3. ISSUED STOCK
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                Printer Logs
              </span>
            </div>
            <div className="flex items-center justify-between gap-2.5">
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {kpiIssued.toLocaleString()} MT
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-rose-600 text-white dark:bg-rose-500 shadow-xs">
                <i className="pi pi-minus-circle text-lg" />
              </div>
            </div>
          </div>
        </Card>

        {/* Card 4: Current Stock */}
        <Card className="relative overflow-hidden border bg-amber-50/70 dark:bg-amber-950/20 border-amber-100/90 dark:border-amber-900/40 transition-all duration-200 hover:shadow-md border-t-transparent!">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 block truncate">
                4. CURRENT STOCK
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                Available
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-2.5">
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {kpiAvailable.toLocaleString()} MT
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-500 text-white shadow-xs">
                <i className="pi pi-box text-lg" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs & Date Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-700 mb-6 gap-4">
        <div className="flex">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all duration-200 -mb-0.5 flex items-center gap-2 ${
              activeTab === "transactions"
                ? "border-primary text-primary dark:text-primary dark:border-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <i className="pi pi-history" />
            Transaction History Log
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`py-3 px-6 font-semibold text-sm border-b-2 transition-all duration-200 -mb-0.5 flex items-center gap-2 ${
              activeTab === "ledger"
                ? "border-primary text-primary dark:text-primary dark:border-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            <i className="pi pi-book" />
            Detailed Stock Ledger
          </button>
        </div>

        {/* Date Filter Panel */}
        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm self-start sm:self-auto -mb-2 sm:mb-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 pr-3">
            <i className="pi pi-calendar text-primary text-sm" />
            <span>DATE FILTER</span>
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-900 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => {
                setDateFilterMode("all");
                setSingleDate("");
                setFromDate("");
                setToDate("");
              }}
              className={`px-2.5 py-1 rounded-md transition-all ${
                dateFilterMode === "all"
                  ? "bg-white dark:bg-gray-800 text-primary dark:text-primary shadow-xs"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setDateFilterMode("single");
                setFromDate("");
                setToDate("");
              }}
              className={`px-2.5 py-1 rounded-md transition-all ${
                dateFilterMode === "single"
                  ? "bg-white dark:bg-gray-800 text-primary dark:text-primary shadow-xs"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              Single
            </button>
            <button
              onClick={() => {
                setDateFilterMode("range");
                setSingleDate("");
              }}
              className={`px-2.5 py-1 rounded-md transition-all ${
                dateFilterMode === "range"
                  ? "bg-white dark:bg-gray-800 text-primary dark:text-primary shadow-xs"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              Range
            </button>
          </div>

          {dateFilterMode === "single" && (
            <div className="flex items-center gap-1">
              <Calendar
                value={singleDate ? new Date(singleDate) : null}
                onChange={(e) => {
                  const d = e.value as Date | null;
                  if (d) {
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    const day = String(d.getDate()).padStart(2, "0");
                    setSingleDate(`${year}-${month}-${day}`);
                  } else {
                    setSingleDate("");
                  }
                }}
                dateFormat="dd-mm-yy"
                showIcon
                placeholder="dd/mm/yyyy"
                className="w-40 text-xs custom-calendar"
                inputClassName="text-xs py-1.5 px-3 bg-gray-50 dark:bg-gray-750 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none"
              />
              {singleDate && (
                <button
                  onClick={() => setSingleDate("")}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-750 rounded text-gray-400 hover:text-gray-600 ml-1"
                  title="Clear Date"
                >
                  <i className="pi pi-times text-[10px]" />
                </button>
              )}
            </div>
          )}

          {dateFilterMode === "range" && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  From
                </span>
                <Calendar
                  value={fromDate ? new Date(fromDate) : null}
                  onChange={(e) => {
                    const d = e.value as Date | null;
                    if (d) {
                      const year = d.getFullYear();
                      const month = String(d.getMonth() + 1).padStart(2, "0");
                      const day = String(d.getDate()).padStart(2, "0");
                      setFromDate(`${year}-${month}-${day}`);
                    } else {
                      setFromDate("");
                    }
                  }}
                  dateFormat="dd-mm-yy"
                  showIcon
                  placeholder="dd/mm/yyyy"
                  className="w-36 text-xs custom-calendar"
                  inputClassName="text-xs py-1.5 px-2 bg-gray-50 dark:bg-gray-750 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  To
                </span>
                <Calendar
                  value={toDate ? new Date(toDate) : null}
                  onChange={(e) => {
                    const d = e.value as Date | null;
                    if (d) {
                      const year = d.getFullYear();
                      const month = String(d.getMonth() + 1).padStart(2, "0");
                      const day = String(d.getDate()).padStart(2, "0");
                      setToDate(`${year}-${month}-${day}`);
                    } else {
                      setToDate("");
                    }
                  }}
                  dateFormat="dd-mm-yy"
                  showIcon
                  placeholder="dd/mm/yyyy"
                  className="w-36 text-xs custom-calendar"
                  inputClassName="text-xs py-1.5 px-2 bg-gray-50 dark:bg-gray-750 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none"
                />
              </div>
              {(fromDate || toDate) && (
                <button
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                  }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-750 rounded text-gray-400 hover:text-gray-600"
                  title="Clear Range"
                >
                  <i className="pi pi-times text-[10px]" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Grid view containing the selected tab */}
      <Card>
        {activeTab === "ledger" ? (
          <GridPanel
            toolbarPlacement="page"
            data={displayTxs}
            searchFields={["transactionNo", "reference"]}
            exportFilename={`Stock_Ledger_GSM_${selectedGsm}`}
            columns={[
              {
                cell: (_, option) => (
                  <span className="text-sm">{option.rowIndex + 1}</span>
                ),
                width: "50px",
                align: "center",
              },
              {
                field: "date",
                header: "Date",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => <span className="text-sm">{formatDate(row.date)}</span>,
              },
              {
                field: "transactionNo",
                header: "Transaction Number",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => (
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {row.transactionNo}
                  </span>
                ),
              },
              {
                field: "type",
                header: "Transaction Type",
                align: "center",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => <TransactionTypeBadge type={row.type} />,
              },
              ...(selectedGsm === "All"
                ? [
                    {
                      field: "gsm" as const,
                      header: "GSM",
                      align: "center" as const,
                      cell: (
                        row: StockTransaction & { calculatedBalance: number },
                      ) => (
                        <span className="text-sm font-bold">{row.gsm} GSM</span>
                      ),
                    },
                  ]
                : []),
              {
                header: "Paper Type",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => {
                  const spec = stocks.find((s) => s.gsm === row.gsm);
                  return (
                    <span className="text-sm">
                      {spec?.paperType || "Text Paper"}
                    </span>
                  );
                },
              },
              {
                field: "reference",
                header: "Reference Source",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {row.reference}
                  </span>
                ),
              },
              {
                header: "Received",
                align: "center",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => {
                  const isIn = row.quantity > 0 && row.type !== "Opening";
                  return (
                    <span className="text-sm font-bold text-emerald-600">
                      {isIn ? `${row.quantity.toLocaleString()} MT` : ""}
                    </span>
                  );
                },
              },
              {
                header: "Issued",
                align: "center",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => {
                  const isOut = row.quantity < 0;
                  return (
                    <span className="text-sm font-bold text-rose-600">
                      {isOut
                        ? `${Math.abs(row.quantity).toLocaleString()} MT`
                        : ""}
                    </span>
                  );
                },
              },
              {
                field: "calculatedBalance",
                header: "Balance Stock",
                align: "center",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => (
                  <span className="text-sm font-bold text-primary dark:text-primary">
                    {row.calculatedBalance.toLocaleString()} MT
                  </span>
                ),
              },
              {
                header: "Remarks",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => (
                  <span className="text-sm italic text-gray-400">
                    {row.remarks || "-"}
                  </span>
                ),
              },
            ]}
          />
        ) : (
          <GridPanel
            toolbarPlacement="page"
            data={displayTxs}
            searchFields={["transactionNo", "gsm", "type", "reference"]}
            exportFilename={`Stock_Transactions_GSM_${selectedGsm}`}
            columns={[
              {
                cell: (_, option) => (
                  <span className="text-sm">{option.rowIndex + 1}</span>
                ),
                width: "50px",
                align: "center",
              },
              {
                field: "date",
                header: "Transaction Date",
                align: "center",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => <span className="text-sm">{formatDate(row.date)}</span>,
              },
              {
                field: "transactionNo",
                header: "Transaction No",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => (
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {row.transactionNo}
                  </span>
                ),
              },
              ...(selectedGsm === "All"
                ? [
                    {
                      field: "gsm" as const,
                      header: "GSM",
                      align: "center" as const,
                      cell: (
                        row: StockTransaction & { calculatedBalance: number },
                      ) => (
                        <span className="text-sm font-semibold">
                          {row.gsm} GSM
                        </span>
                      ),
                    },
                  ]
                : []),
              {
                field: "type",
                header: "Transaction Type",
                align: "center",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => <TransactionTypeBadge type={row.type} />,
              },
              {
                field: "reference",
                header: "Reference Source / Details",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => (
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {row.reference}
                  </span>
                ),
              },
              {
                field: "quantity",
                header: "Quantity (MT)",
                align: "center",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => {
                  const isPositive = row.quantity > 0;
                  return (
                    <span
                      className={`text-sm font-bold ${
                        row.type === "Opening"
                          ? "text-gray-700 dark:text-gray-300"
                          : isPositive
                            ? "text-emerald-600"
                            : "text-rose-600"
                      }`}
                    >
                      {isPositive && row.type !== "Opening" ? "+" : ""}
                      {row.quantity.toLocaleString()} MT
                    </span>
                  );
                },
              },
              {
                field: "calculatedBalance",
                header: "Running Balance",
                align: "center",
                cell: (
                  row: StockTransaction & { calculatedBalance: number },
                ) => (
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                    {row.calculatedBalance.toLocaleString()} MT
                  </span>
                ),
              },
            ]}
          />
        )}
      </Card>
    </Page>
  );
}
