import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { dataManager } from "../../mockData";
import type { PaperDistribution } from "../../types";

export default function DispatchPage() {
  const distributions = dataManager.getDistributions();

  return (
    <Page
      header="Dispatch Status Tracking"
      subHeader="प्रेषण स्थिति ट्रैकिंग — Track paper shipment dispatches, transport vehicle assignments, and delivery statuses."
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={[...distributions].reverse()}
          searchFields={["challanNo", "printer", "vehicleNo"]}
          exportFilename="Paper_Dispatch_Shipments"
          columns={[
            {
              cell: (_, option) => (
                <span className="text-xs">{option.rowIndex + 1}</span>
              ),
              width: "50px",
              align: "center",
            },
            {
              field: "challanNo",
              header: "Challan / Dist No",
              cell: (row: PaperDistribution) => (
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {row.challanNo}
                </span>
              ),
            },
            {
              field: "distributionDate",
              header: "Date Issued",
              cell: (row: PaperDistribution) => (
                <span className="text-xs">{row.distributionDate}</span>
              ),
            },
            {
              field: "printer",
              header: "Printer Press Name",
              cell: (row: PaperDistribution) => (
                <span className="text-xs font-semibold">{row.printer}</span>
              ),
            },
            {
              field: "orderNo",
              header: "Order Ref",
              cell: (row: PaperDistribution) => (
                <span className="text-xs font-bold text-indigo-650">
                  {row.orderNo}
                </span>
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
              header: "Qty Dispatched",
              align: "right",
              cell: (row: PaperDistribution) => (
                <span className="text-xs text-emerald-600 font-extrabold">
                  {row.issueQuantity.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "vehicleNo",
              header: "Vehicle Number",
              cell: (row: PaperDistribution) => (
                <span className="text-xs font-medium">{row.vehicleNo}</span>
              ),
            },
            {
              field: "driverName",
              header: "Driver Name",
              cell: (row: PaperDistribution) => (
                <span className="text-xs">{row.driverName || "-"}</span>
              ),
            },
            {
              field: "status",
              header: "Delivery Status",
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
