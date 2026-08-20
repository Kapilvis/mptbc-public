import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { dataManager } from "../../../inventory/mockData";
import type { PrinterOrder } from "../../../inventory/types";
import PaperIssueViewDetailsModal from "../components/PaperIssueViewDetailsModal";

function OrderStatusBadge({ status }: { status: PrinterOrder["status"] }) {
  const cls =
    {
      Pending:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
      Approved:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50",
      "Partially Supplied":
        "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50",
      Completed:
        "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50",
      Rejected:
        "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50",
      Cancelled:
        "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    }[status] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${cls}`}
    >
      {status}
    </span>
  );
}

const formatToDDMMYYYY = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};

export default function PaperIssueToPrinterPage() {
  const navigate = useNavigate();

  // 1. Core Data
  const distributions = useMemo(() => dataManager.getDistributions(), []);
  const orders = useMemo(() => dataManager.getOrders(), []);

  // 2. Selection States for Modals
  const [selectedOrderForDetails, setSelectedOrderForDetails] =
    useState<PrinterOrder | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  // 3. Action Handlers
  const handleOpenDetails = (orderNo: string) => {
    const matchedOrder = orders.find((o) => o.orderNo === orderNo);
    if (matchedOrder) {
      setSelectedOrderForDetails(matchedOrder);
      setIsDetailsVisible(true);
    }
  };

  // 4. View details history helper
  const selectedOrderHistory = useMemo(() => {
    if (!selectedOrderForDetails) return [];
    return distributions.filter(
      (d) => d.orderNo === selectedOrderForDetails.orderNo,
    );
  }, [selectedOrderForDetails, distributions]);

  return (
    <Page
      header="Paper Issue to Printer"
      subHeader="कागज निर्गम प्रविष्टि — Dispatch approved paper allocations from Central Depot to registered printers against print orders."
      showHeaderActions
    >
      {/* Main Paper Issue Table */}
      <Card>
        <GridPanel
          toolbarPlacement="page"
          toolbar={
            <Button
              label="Add"
              icon="pi pi-plus"
              onClick={() =>
                navigate("/distribution/paper-issue-to-printer/create")
              }
            />
          }
          data={[...orders].filter((o) => o.status !== "Cancelled").reverse()}
          searchFields={[
            "orderNo",
            "printer",
            "bookTitle",
            "classLevel",
            "subject",
          ]}
          exportFilename="Printer_Paper_Issue_Allocations"
          columns={[
            {
              cell: (_, option) => (
                <span className="text-xs">{option.rowIndex + 1}</span>
              ),
              width: "50px",
              align: "center",
              header: "s.no",
            },
            {
              field: "orderNo",
              header: "Issue number",
              cell: (row: PrinterOrder) => (
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {row.orderNo}
                </span>
              ),
            },
            {
              field: "orderDate",
              header: "issue date",
              cell: (row: PrinterOrder) => (
                <span className="text-sm font-medium">
                  {formatToDDMMYYYY(row.orderDate)}
                </span>
              ),
            },
            {
              field: "printer",
              header: "printer name",
              cell: (row: PrinterOrder) => (
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {row.printer}
                </span>
              ),
            },
            {
              field: "approvedQty",
              header: "total required paper",
              align: "center",
              cell: (row: PrinterOrder) => (
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {row.approvedQty.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "suppliedQty",
              header: "recived paper",
              align: "center",
              cell: (row: PrinterOrder) => (
                <span className="text-xs text-emerald-600 font-bold">
                  {row.suppliedQty.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "pendingQty",
              header: "remaning paper",
              align: "center",
              cell: (row: PrinterOrder) => (
                <span
                  className={`text-xs font-extrabold ${
                    row.pendingQty > 0 ? "text-rose-600" : "text-slate-400"
                  }`}
                >
                  {row.pendingQty.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "status",
              header: "status",
              align: "center",
              cell: (row: PrinterOrder) => (
                <OrderStatusBadge status={row.status} />
              ),
            },
            {
              header: "action",
              align: "center",
              cell: (row: PrinterOrder) => {
                const isFullyIssued =
                  row.status === "Completed" || row.pendingQty <= 0;

                return (
                  <div className="flex items-center gap-1.5 justify-center">
                    <Button
                      label="View"
                      icon="pi pi-eye"
                      size="small"
                      variant="outlined"
                      className="py-0.5! px-2! text-[10px]!"
                      onClick={() => handleOpenDetails(row.orderNo)}
                    />
                    <Button
                      label="Issue"
                      icon="pi pi-plus"
                      size="small"
                      variant="outlined"
                      className="py-0.5! px-2! text-[10px]! text-emerald-600! border-emerald-500! hover:bg-emerald-50!"
                      disabled={isFullyIssued}
                      onClick={() =>
                        navigate(
                          `/distribution/paper-issue-to-printer/create?orderNo=${row.orderNo}`,
                        )
                      }
                    />
                  </div>
                );
              },
            },
          ]}
        />
      </Card>

      {/* Detailed History View Modal */}
      {selectedOrderForDetails && (
        <PaperIssueViewDetailsModal
          visible={isDetailsVisible}
          onHide={() => {
            setIsDetailsVisible(false);
            setSelectedOrderForDetails(null);
          }}
          order={selectedOrderForDetails}
          history={selectedOrderHistory}
        />
      )}
    </Page>
  );
}
