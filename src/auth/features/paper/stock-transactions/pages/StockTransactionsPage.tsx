import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { dataManager } from "../../../inventory/mockData";
import type { StockTransaction } from "../../../inventory/types";

function TransactionTypeBadge({ type }: { type: StockTransaction["type"] }) {
  const cls =
    {
      Opening:
        "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
      Receipt:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50",
      Distribution:
        "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
      Adjustment:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
      Return:
        "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50",
    }[type] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${cls}`}
    >
      {type}
    </span>
  );
}

export default function StockTransactionsPage() {
  const pageTitle = usePageTitle();
  const transactions = dataManager.getTransactions();

  // Reverse list so latest transactions are at the top
  const sortedTransactions = [...transactions].reverse();

  return (
    <Page
      header={pageTitle || "Stock Transactions"}
      subHeader="स्टॉक लेनदेन इतिहास — View all incoming receipts, outgoing distributions, and adjustments logged by the depot."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={sortedTransactions}
          searchFields={["transactionNo", "gsm", "type", "reference"]}
          exportFilename="Stock_Transactions_History"
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
              cell: (row: StockTransaction) => (
                <span className="text-sm">{row.date}</span>
              ),
            },
            {
              field: "transactionNo",
              header: "Transaction No",
              cell: (row: StockTransaction) => (
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {row.transactionNo}
                </span>
              ),
            },
            {
              field: "gsm",
              header: "GSM",
              align: "center",
              cell: (row: StockTransaction) => (
                <span className="text-sm font-semibold">{row.gsm} GSM</span>
              ),
            },
            {
              field: "type",
              header: "Transaction Type",
              align: "center",
              cell: (row: StockTransaction) => (
                <TransactionTypeBadge type={row.type} />
              ),
            },
            {
              field: "reference",
              header: "Reference Source / Details",
              cell: (row: StockTransaction) => (
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {row.reference}
                </span>
              ),
            },
            {
              field: "quantity",
              header: "Quantity (MT)",
              align: "center",
              cell: (row: StockTransaction) => {
                const isPositive = row.quantity > 0;
                return (
                  <span
                    className={`text-sm font-bold ${row.type === "Opening" ? "text-gray-700 dark:text-gray-300" : isPositive ? "text-emerald-600" : "text-rose-600"}`}
                  >
                    {isPositive && row.type !== "Opening" ? "+" : ""}
                    {row.quantity.toLocaleString()} MT
                  </span>
                );
              },
            },
            {
              field: "balance",
              header: "Running Balance",
              align: "center",
              cell: (row: StockTransaction) => (
                <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                  {row.balance.toLocaleString()} MT
                </span>
              ),
            },
          ]}
        />
      </Card>
    </Page>
  );
}
