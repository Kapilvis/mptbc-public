import { useNavigate } from "react-router-dom";
import { GridPanel } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import type { SavedOrder, OrderStatus } from "../printerDemandMapping.types";
import { formatDate } from "shared/utils/dateUtils";

interface ApprovedDemandGridProps {
  data: SavedOrder[];
  onViewDetailsClick: (orderNo: string) => void;
  onWorkReAllocationClick: (orderNo: string) => void;
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<OrderStatus, { label: string; cls: string }> = {
    InProgress: {
      label: "In Progress",
      cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/40",
    },
    Completed: {
      label: "Completed",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40",
    },
    ReAllocated: {
      label: "Re-Allocated",
      cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/40",
    },
    Cancelled: {
      label: "Cancelled",
      cls: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-300 dark:border-red-900/40",
    },
  };

  const c = config[status] ?? config["InProgress"];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${c.cls}`}
    >
      {c.label}
    </span>
  );
}

export default function ApprovedDemandGrid({
  data,
  onViewDetailsClick,
  onWorkReAllocationClick,
}: ApprovedDemandGridProps) {
  const navigate = useNavigate();

  return (
    <GridPanel<SavedOrder>
      toolbarPlacement="page"
      toolbar={
        <Button
          label="Add"
          icon="plus"
          onClick={() => navigate("/distribution/printer-demand-mapping/new")}
          variant="primary"
        />
      }
      data={data}
      showExport
      exportFilename="Printer_Allocation_Orders"
      columns={[
        {
          cell: (_, option) => (
            <span className="text-gray-500 font-medium">
              {option.rowIndex + 1}
            </span>
          ),
          width: "60px",
          align: "center",
          header: "S.No.",
        },
        {
          field: "orderNo",
          header: "Order Number",
          cell: (row) => (
            <span className="font-mono font-bold text-gray-900 dark:text-white">
              {row.orderNo}
            </span>
          ),
          width: "150px",
        },
        {
          field: "printerName",
          header: "Printer Name",
          cell: (row) => (
            <div>
              <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                {row.printerName}
              </span>
              <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 mt-0.5 block">
                {row.printerCode}
              </span>
            </div>
          ),
        },
        {
          field: "deliveryDepot",
          header: "Delivery Depot",
          align: "center",
          cell: (row) => (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40 uppercase tracking-wide">
              {row.deliveryDepot}
            </span>
          ),
          width: "150px",
          footer: (
            <span className="font-bold text-gray-900 dark:text-white block text-right pr-2">
              Total:
            </span>
          ),
        },
        {
          field: "totalQuantity",
          header: "Total Books",
          align: "center",
          footer: (() => {
            const sum = data.reduce((acc, row) => acc + row.totalQuantity, 0);
            return (
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                {sum.toLocaleString()}
              </span>
            );
          })(),
          cell: (row) => (
            <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
              {row.totalQuantity.toLocaleString()}
            </span>
          ),
          width: "140px",
        },
        {
          field: "expectedDeliveryDate",
          header: "Expected Delivery",
          align: "center",
          cell: (row) => {
            const formatted = formatDate(row.expectedDeliveryDate).replace(
              /\//g,
              "-",
            );
            return (
              <span className="font-mono text-gray-700 dark:text-gray-300">
                {formatted || row.expectedDeliveryDate || "N/A"}
              </span>
            );
          },
          width: "160px",
        },
        {
          field: "status",
          header: "Status",
          align: "center",
          width: "130px",
          cell: (row) => <StatusBadge status={row.status} />,
        },
        {
          header: "Action",
          align: "center",
          width: "220px",
          cell: (row) => (
            <div className="flex items-center justify-center gap-1.5">
              <Button
                label="View"
                icon="eye"
                variant="outlined"
                size="small"
                onClick={() => onViewDetailsClick(row.orderNo)}
              />
              {row.status === "InProgress" && (
                <Button
                  label="Re-Allocate"
                  icon="refresh"
                  variant="warning"
                  size="small"
                  onClick={() => onWorkReAllocationClick(row.orderNo)}
                />
              )}
            </div>
          ),
        },
      ]}
    />
  );
}
