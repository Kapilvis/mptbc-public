import { useMemo } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import { dataManager } from "../../../inventory/mockData";
import type { PrinterOrder } from "../../../inventory/types";
import { formatDate } from "shared/utils/dateUtils";

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

const formatDateWithHyphens = (dateStr: string | Date | undefined | null) => {
  const formatted = formatDate(dateStr);
  return formatted ? formatted.replace(/\//g, "-") : "";
};

interface Props {
  pendingOnly?: boolean;
}

export default function PrinterOrdersPage({ pendingOnly = false }: Props) {
  const pageTitle = usePageTitle();
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

  const totals = useMemo(() => {
    return filteredOrders.reduce(
      (acc, o) => ({
        approved: acc.approved + o.approvedQty,
        supplied: acc.supplied + o.suppliedQty,
        pending: acc.pending + o.pendingQty,
      }),
      { approved: 0, supplied: 0, pending: 0 },
    );
  }, [filteredOrders]);

  const fulfillmentPercent = Math.round(
    (totals.supplied / (totals.approved || 1)) * 100,
  );

  const kpiCards = [
    {
      label: "Total Work Allocation",
      value: `${totals.approved.toLocaleString()}`,
      subLabel: "Allocated Printing Work Orders",
      icon: "pi-book",
      accent: "border-l-indigo-600",
      iconBg:
        "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50",
      subColor: "text-indigo-600",
    },
    {
      label: "Total Books Supplied",
      value: `${totals.supplied.toLocaleString()}`,
      subLabel: `${fulfillmentPercent}% Printed & Delivered`,
      icon: "pi-check-circle",
      accent: "border-l-emerald-600",
      iconBg:
        "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50",
      subColor: "text-emerald-600",
    },
    {
      label: "Pending Printing Balance",
      value: `${totals.pending.toLocaleString()}`,
      subLabel: `${100 - fulfillmentPercent}% Work in Progress`,
      icon: "pi-clock",
      accent: "border-l-amber-500",
      iconBg:
        "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50",
      subColor: "text-amber-600",
    },
    {
      label: "Active Orders Count",
      value: filteredOrders.length.toString(),
      subLabel: "Registered Printing Orders",
      icon: "pi-file",
      accent: "border-l-purple-600",
      iconBg:
        "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800/50",
      subColor: "text-purple-600",
    },
  ];

  return (
    <Page
      header={
        pageTitle ||
        (pendingOnly ? "Pending Printer Orders" : "Printer Order Management")
      }
      subHeader={
        pendingOnly
          ? "लंबित प्रिंटर आदेश — Review printer orders waiting for paper allocation and dispatch."
          : "प्रिंटर आदेश प्रबंधन — Track paper requirements, approval statuses, and allocations for 3,90,000 books."
      }
      showHeaderActions
    >
      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {kpiCards.map((kpi) => (
          <Card
            key={kpi.label}
            className={`border-l-4 ${kpi.accent} border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow`}
          >
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  {kpi.label}
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {kpi.value}
                </div>
                <div
                  className={`mt-1 flex items-center gap-1.5 text-xs ${kpi.subColor} font-semibold`}
                >
                  <i className={`pi ${kpi.icon} text-[11px]`} />
                  <span>{kpi.subLabel}</span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${kpi.iconBg}`}
              >
                <i className={`pi ${kpi.icon} text-xl`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

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
                <span className="text-sm">
                  {formatDateWithHyphens(row.orderDate)}
                </span>
              ),
            },
            {
              field: "printer",
              header: "Printer / Press Name",
              cell: (row: PrinterOrder) => (
                <span className="text-sm font-semibold">{row.printer}</span>
              ),
              footer: <span className="font-bold text-slate-700">Total</span>,
            },
            {
              field: "approvedQty",
              header: "Total",
              align: "center",
              cell: (row: PrinterOrder) => (
                <span className="text-sm text-blue-700 dark:text-blue-400 font-semibold">
                  {row.approvedQty.toLocaleString()}
                </span>
              ),
              footer: (
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  {totals.approved.toLocaleString()}
                </span>
              ),
            },
            {
              field: "suppliedQty",
              header: "Supplied",
              align: "center",
              cell: (row: PrinterOrder) => (
                <span className="text-sm text-emerald-600 font-semibold">
                  {row.suppliedQty.toLocaleString()}
                </span>
              ),
              footer: (
                <span className="font-bold text-emerald-600">
                  {totals.supplied.toLocaleString()}
                </span>
              ),
            },
            {
              field: "pendingQty",
              header: "Pending",
              align: "center",
              cell: (row: PrinterOrder) => (
                <span className="text-sm text-orange-600 font-bold">
                  {row.pendingQty.toLocaleString()}
                </span>
              ),
              footer: (
                <span className="font-bold text-orange-600">
                  {totals.pending.toLocaleString()}
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
          ]}
        />
      </Card>
    </Page>
  );
}
