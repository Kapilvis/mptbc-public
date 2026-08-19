import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel, InputPanel } from "shared/components/panels";
import { Button, ButtonPanel } from "shared/components/buttons";
import { DropDownList, DatePicker } from "shared/components/forms";
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
  const printerList = dataManager.getPrinterMasterList();

  // Filters State
  const [printerFilter, setPrinterFilter] = useState("");
  const [gsmFilter, setGsmFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [requiredDate, setRequiredDate] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Sidebar Pending Orders Filter
      if (
        pendingOnly &&
        o.status !== "Pending" &&
        o.status !== "Partially Supplied"
      )
        return false;

      // Dropdown Filters
      if (printerFilter && o.printer !== printerFilter) return false;
      if (gsmFilter && o.gsm.toString() !== gsmFilter) return false;
      if (statusFilter && o.status !== statusFilter) return false;
      if (orderDate && o.orderDate !== orderDate) return false;
      if (requiredDate && o.requiredByDate !== requiredDate) return false;

      return true;
    });
  }, [
    orders,
    pendingOnly,
    printerFilter,
    gsmFilter,
    statusFilter,
    orderDate,
    requiredDate,
  ]);

  const handleResetFilters = () => {
    setPrinterFilter("");
    setGsmFilter("");
    setStatusFilter("");
    setOrderDate("");
    setRequiredDate("");
  };

  const printerOptions = useMemo(() => {
    return printerList.map((p) => ({
      text: p.printerName,
      value: p.printerName,
    }));
  }, [printerList]);

  const gsmOptions = [
    { text: "58 GSM", value: "58" },
    { text: "60 GSM", value: "60" },
    { text: "70 GSM", value: "70" },
    { text: "80 GSM", value: "80" },
  ];

  const statusOptions = [
    { text: "Pending", value: "Pending" },
    { text: "Approved", value: "Approved" },
    { text: "Partially Supplied", value: "Partially Supplied" },
    { text: "Completed", value: "Completed" },
    { text: "Rejected", value: "Rejected" },
    { text: "Cancelled", value: "Cancelled" },
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
          : "प्रिंटर आदेश प्रबंधन — Track paper requirements, approval statuses, and quantities."
      }
      showHeaderActions
    >
      {/* Filters Card */}
      <Card className="mb-4 p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-150/40">
          <div className="flex items-center gap-2">
            <i className="pi pi-filter text-blue-600 font-bold" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Filter Printer Orders
            </span>
          </div>
          <ButtonPanel>
            <Button
              type="button"
              label="Reset Filters"
              icon="pi pi-refresh"
              onClick={handleResetFilters}
              className="p-button-outlined p-button-secondary p-button-sm text-xs! py-1!"
            />
          </ButtonPanel>
        </div>

        <InputPanel orientation="horizontal">
          <DropDownList
            label="Select Printer"
            data={printerOptions}
            textField="text"
            valueField="value"
            value={printerFilter}
            onChange={(val) => setPrinterFilter(val as string)}
            defaultOptionText="All Printers"
          />

          <DropDownList
            label="GSM Specification"
            data={gsmOptions}
            textField="text"
            valueField="value"
            value={gsmFilter}
            onChange={(val) => setGsmFilter(val as string)}
            defaultOptionText="All GSMs"
          />

          {!pendingOnly && (
            <DropDownList
              label="Order Status"
              data={statusOptions}
              textField="text"
              valueField="value"
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as string)}
              defaultOptionText="All Statuses"
            />
          )}

          <DatePicker
            label="Order Date"
            value={orderDate}
            onChange={(val) =>
              setOrderDate(val ? val.toISOString().split("T")[0] : "")
            }
          />

          <DatePicker
            label="Required Date"
            value={requiredDate}
            onChange={(val) =>
              setRequiredDate(val ? val.toISOString().split("T")[0] : "")
            }
          />
        </InputPanel>
      </Card>

      {/* Grid Panel List */}
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
                <span className="text-xs">{option.rowIndex + 1}</span>
              ),
              width: "50px",
              align: "center",
            },
            {
              field: "orderNo",
              header: "Order No",
              cell: (row: PrinterOrder) => (
                <span className="text-xs font-bold text-indigo-950 dark:text-white">
                  {row.orderNo}
                </span>
              ),
            },
            {
              field: "orderDate",
              header: "Order Date",
              cell: (row: PrinterOrder) => (
                <span className="text-xs">{row.orderDate}</span>
              ),
            },
            {
              field: "printer",
              header: "Printer / Press Name",
              cell: (row: PrinterOrder) => (
                <span className="text-xs font-semibold">{row.printer}</span>
              ),
            },
            {
              field: "gsm",
              header: "GSM",
              align: "center",
              cell: (row: PrinterOrder) => (
                <span className="text-xs font-bold">{row.gsm} GSM</span>
              ),
            },
            {
              field: "paperType",
              header: "Paper Type",
              cell: (row: PrinterOrder) => (
                <span className="text-xs">{row.paperType}</span>
              ),
            },
            {
              field: "requiredQty",
              header: "Req Qty",
              align: "right",
              cell: (row: PrinterOrder) => (
                <span className="text-xs">
                  {row.requiredQty.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "approvedQty",
              header: "Appr Qty",
              align: "right",
              cell: (row: PrinterOrder) => (
                <span className="text-xs text-blue-700 dark:text-blue-400 font-semibold">
                  {row.approvedQty.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "suppliedQty",
              header: "Supplied Qty",
              align: "right",
              cell: (row: PrinterOrder) => (
                <span className="text-xs text-emerald-600 font-semibold">
                  {row.suppliedQty.toLocaleString()} MT
                </span>
              ),
            },
            {
              field: "pendingQty",
              header: "Pending Qty",
              align: "right",
              cell: (row: PrinterOrder) => (
                <span className="text-xs text-rose-600 font-bold">
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
                  className="p-button-outlined p-button-sm text-xs! py-1!"
                />
              ),
            },
          ]}
        />
      </Card>
    </Page>
  );
}
