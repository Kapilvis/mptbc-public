import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { dataManager } from "../../../inventory/mockData";
import type { StockTransaction } from "../../../inventory/types";

export default function StockLedgerPage() {
  const pageTitle = usePageTitle();
  const transactions = dataManager.getTransactions();
  const stocks = dataManager.getStocks();

  return (
    <Page
      header={pageTitle || "Detailed Stock Ledger"}
      subHeader="विस्तृत स्टॉक लेजर — View and export ledger accounts containing detailed paper ledger tracking."
      showHeaderActions
    >
      {/* Grid Ledger */}
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={transactions}
          searchFields={["transactionNo", "reference"]}
          exportFilename="Stock_Ledger_Account"
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
              cell: (row: StockTransaction) => (
                <span className="text-sm">{row.date}</span>
              ),
            },
            {
              field: "transactionNo",
              header: "Transaction Number",
              cell: (row: StockTransaction) => (
                <span className="text-sm font-bold text-indigo-950 dark:text-white">
                  {row.transactionNo}
                </span>
              ),
            },
            {
              field: "type",
              header: "Transaction Type",
              cell: (row: StockTransaction) => (
                <span className="text-sm font-semibold uppercase">
                  {row.type}
                </span>
              ),
            },
            {
              field: "gsm",
              header: "GSM",
              align: "center",
              cell: (row: StockTransaction) => (
                <span className="text-sm font-bold">{row.gsm} GSM</span>
              ),
            },
            {
              header: "Paper Type",
              cell: (row: StockTransaction) => {
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
              cell: (row: StockTransaction) => (
                <span className="text-sm text-gray-500">{row.reference}</span>
              ),
            },
            {
              header: "Quantity In (Receipt)",
              align: "center",
              cell: (row: StockTransaction) => {
                const isIn = row.quantity > 0 && row.type !== "Opening";
                return (
                  <span className="text-sm font-bold text-emerald-600">
                    {isIn ? `${row.quantity.toLocaleString()} MT` : ""}
                  </span>
                );
              },
            },
            {
              header: "Quantity Out (Issued)",
              align: "center",
              cell: (row: StockTransaction) => {
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
              field: "balance",
              header: "Balance Stock",
              align: "center",
              cell: (row: StockTransaction) => (
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
                  {row.balance.toLocaleString()} MT
                </span>
              ),
            },
            {
              header: "Remarks",
              cell: (row: StockTransaction) => (
                <span className="text-sm italic text-gray-400">
                  {row.remarks || "-"}
                </span>
              ),
            },
          ]}
        />
      </Card>
    </Page>
  );
}
