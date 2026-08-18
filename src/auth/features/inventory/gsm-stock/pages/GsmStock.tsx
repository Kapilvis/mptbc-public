import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { dataManager } from "../../mockData";
import type { PaperStock } from "../../types";
import { StockStatusBadge } from "../../../paper/paper-stock/pages/PaperStockPage";

export default function GsmStockPage() {
  const stocks = dataManager.getStocks();

  return (
    <Page
      header="GSM-wise Stock Availability"
      subHeader="जीएसएम-वार उपलब्ध स्टॉक — Check available paper quantities and specifications for each GSM."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={stocks}
          searchFields={["gsm", "paperType"]}
          exportFilename="GSM_Wise_Paper_Stock"
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
                <span className="text-sm font-extrabold">{row.gsm} GSM</span>
              ),
            },
            {
              field: "paperType",
              header: "Paper Type",
              cell: (row: PaperStock) => (
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
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
              header: "Received Quantity",
              align: "right",
              cell: (row: PaperStock) => (
                <span className="text-xs text-emerald-600 font-medium">
                  {row.receivedQuantity.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "issuedQuantity",
              header: "Issued Quantity",
              align: "right",
              cell: (row: PaperStock) => (
                <span className="text-xs text-rose-600 font-medium">
                  {row.issuedQuantity.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "availableQuantity",
              header: "Available Stock",
              align: "right",
              cell: (row: PaperStock) => (
                <span className="text-sm font-extrabold text-blue-700 dark:text-blue-400">
                  {row.availableQuantity.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "stockStatus",
              header: "Status",
              align: "center",
              cell: (row: PaperStock) => (
                <StockStatusBadge status={row.stockStatus} />
              ),
            },
          ]}
        />
      </Card>
    </Page>
  );
}
