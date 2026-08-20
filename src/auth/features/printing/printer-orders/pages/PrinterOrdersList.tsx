import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { dataManager } from "../../../inventory/mockData";
import type { PrinterOrder } from "../../../inventory/types";

export function OrderStatusBadge({
  status,
}: {
  status: PrinterOrder["status"];
}) {
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

interface Props {
  pendingOnly?: boolean;
}

export default function PrinterOrdersPage({ pendingOnly = false }: Props) {
  const pageTitle = usePageTitle();
  const navigate = useNavigate();
  const orders = dataManager.getOrders();

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Sidebar Pending Orders Filter
      if (
        pendingOnly &&
        o.status !== "Pending" &&
        o.status !== "Partially Supplied"
      )
        return false;

      return true;
    });
  }, [orders, pendingOnly]);

  return (
    <Page
      header={
        pageTitle ||
        (pendingOnly ? "Pending Printer Orders" : "Printer Order Management")
      }
      subHeader={
        pendingOnly
          ? "लंबित प्रिंटर आदेश — Review printer orders waiting for paper allocation and dispatch."
          : "प्रिंटर आदेश प्रबंधन — Track paper requirements, approval statuses, and quantities."
      }
      showHeaderActions
    >
      <Card>
        <GridPanel
          toolbarPlacement="page"
          data={filteredOrders}
          searchFields={["orderNo", "printer", "bookTitle"]}
          exportFilename={
            pendingOnly ? "Pending_Printer_Orders" : "All_Printer_Orders"
          }
          columns={[
            {
              cell: (_, option) => (
                <span className="text-sm">{option.rowIndex + 1}</span>
              ),
              width: "50px",
              align: "center",
            },
            {
              field: "orderNo",
              header: "Order No",
              cell: (row: PrinterOrder) => (
                <span className="text-sm font-bold text-indigo-950 dark:text-white">
                  {row.orderNo}
                </span>
              ),
            },
            {
              field: "orderDate",
              header: "Order Date",
              cell: (row: PrinterOrder) => (
                <span className="text-sm">{row.orderDate}</span>
              ),
            },
            {
              field: "printer",
              header: "Printer / Press Name",
              cell: (row: PrinterOrder) => (
                <span className="text-sm font-semibold">{row.printer}</span>
              ),
            },
            {
              field: "gsm",
              header: "GSM",
              align: "center",
              cell: (row: PrinterOrder) => (
                <span className="text-sm font-bold">{row.gsm} GSM</span>
              ),
            },
            {
              field: "paperType",
              header: "Paper Type",
              cell: (row: PrinterOrder) => (
                <span className="text-sm">{row.paperType}</span>
              ),
            },
            {
              field: "requiredQty",
              header: "Req Qty",
              align: "center",
              cell: (row: PrinterOrder) => (
                <span className="text-sm">
                  {row.requiredQty.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "approvedQty",
              header: "Appr Qty",
              align: "center",
              cell: (row: PrinterOrder) => (
                <span className="text-sm text-blue-700 dark:text-blue-400 font-semibold">
                  {row.approvedQty.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "suppliedQty",
              header: "Supplied Qty",
              align: "center",
              cell: (row: PrinterOrder) => (
                <span className="text-sm text-emerald-600 font-semibold">
                  {row.suppliedQty.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "pendingQty",
              header: "Pending Qty",
              align: "center",
              cell: (row: PrinterOrder) => (
                <span className="text-sm text-rose-600 font-bold">
                  {row.pendingQty.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "status",
              header: "Status",
              align: "center",
              cell: (row: PrinterOrder) => (
                <OrderStatusBadge status={row.status} />
              ),
            },
            {
              header: "Action",
              align: "center",
              cell: (row: PrinterOrder) => (
                <Button
                  type="button"
                  label="View Details"
                  icon="pi pi-eye"
                  onClick={() =>
                    navigate(`/printing/orders/details/${row.orderNo}`)
                  }
                  className="p-button-outlined p-button-sm text-sm! py-1!"
                />
              ),
            },
          ]}
        />
      </Card>
    </Page>
  );
}
