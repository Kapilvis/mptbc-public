import { useState } from "react";
import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { dataManager } from "../../../inventory/mockData";
import type { PaperReceipt } from "../../../inventory/types";
import CreateReceiving from "./CreateReceiving";

export default function PaperReceivingPage() {
  const [receipts, setReceipts] = useState<PaperReceipt[]>(() =>
    dataManager.getReceipts(),
  );

  const handleRefresh = () => {
    setReceipts([...dataManager.getReceipts()]);
  };

  const CreateFormWrapper = ({ onSave }: { onSave: () => void }) => {
    return (
      <CreateReceiving
        onSave={() => {
          handleRefresh();
          onSave();
        }}
      />
    );
  };

  return (
    <Page
      header="Paper Stock In (Receiving)"
      subHeader="कागज प्राप्ति प्रविष्टि — Record and log incoming paper rolls from registered paper vendors."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={[...receipts].reverse()}
          searchFields={["receiptNo", "supplier", "vehicleNo", "challanNo"]}
          exportFilename="Paper_Receipt_Logs"
          CreateForm={CreateFormWrapper}
          columns={[
            {
              cell: (_, option) => (
                <span className="text-xs">{option.rowIndex + 1}</span>
              ),
              width: "50px",
              align: "center",
            },
            {
              field: "receiptNo",
              header: "Receipt No",
              cell: (row: PaperReceipt) => (
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {row.receiptNo}
                </span>
              ),
            },
            {
              field: "receiptDate",
              header: "Date",
              cell: (row: PaperReceipt) => (
                <span className="text-xs">{row.receiptDate}</span>
              ),
            },
            {
              field: "supplier",
              header: "Vendor / Supplier",
              cell: (row: PaperReceipt) => (
                <span className="text-xs font-semibold">{row.supplier}</span>
              ),
            },
            {
              field: "gsm",
              header: "GSM",
              align: "center",
              cell: (row: PaperReceipt) => (
                <span className="text-xs font-bold">{row.gsm} GSM</span>
              ),
            },
            {
              field: "quantity",
              header: "Received Qty",
              align: "right",
              cell: (row: PaperReceipt) => (
                <span className="text-xs font-bold text-emerald-600">
                  {row.quantity.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "vehicleNo",
              header: "Vehicle No",
              cell: (row: PaperReceipt) => (
                <span className="text-xs">{row.vehicleNo}</span>
              ),
            },
            {
              field: "challanNo",
              header: "Challan No",
              cell: (row: PaperReceipt) => (
                <span className="text-xs">{row.challanNo}</span>
              ),
            },
          ]}
        />
      </Card>
    </Page>
  );
}
