import { useNavigate } from "react-router-dom";
import { GridPanel } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import type { SavedOrder } from "../printerDemandMapping.types";
import { formatDate } from "shared/utils/dateUtils";

interface ApprovedDemandGridProps {
  data: SavedOrder[];
  onViewDetailsClick: (orderNo: string) => void;
}

export default function ApprovedDemandGrid({
  data,
  onViewDetailsClick,
}: ApprovedDemandGridProps) {
  const navigate = useNavigate();

  return (
    <GridPanel
      toolbarPlacement="page"
      toolbar={
        <Button
          label="Add"
          icon="plus"
          onClick={() => navigate("/distribution/printer-demand-mapping/new")}
          variant="primary"
          className="shadow-sm font-bold text-xs"
        />
      }
      data={data}
      showExport
      exportFilename="Printer_Allocation_Orders"
      columns={[
        {
          cell: (_, option) => (
            <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
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
            <span className="font-mono font-bold text-gray-900 dark:text-white text-sm">
              {row.orderNo}
            </span>
          ),
          width: "140px",
        },
        {
          field: "printerName",
          header: "Printer Name",
          cell: (row) => (
            <div>
              <span className="font-bold text-gray-900 dark:text-gray-100 block text-sm">
                {row.printerName}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-300 font-mono font-semibold mt-1 block">
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
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/35 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30">
              {row.deliveryDepot}
            </span>
          ),
          width: "140px",
        },
        {
          field: "totalQuantity",
          header: "Total Quantity",
          align: "center",
          cell: (row) => (
            <span className="font-mono text-gray-950 dark:text-gray-50 text-sm font-semibold">
              {row.totalQuantity.toLocaleString()} Books
            </span>
          ),
          width: "140px",
        },
        {
          field: "expectedDeliveryDate",
          header: "Expected Delivery Date",
          align: "center",
          cell: (row) => {
            const formatted = formatDate(row.expectedDeliveryDate).replace(
              /\//g,
              "-",
            );
            return (
              <span className="font-mono text-gray-950 dark:text-gray-50 text-sm font-semibold">
                {formatted || row.expectedDeliveryDate || "N/A"}
              </span>
            );
          },
          width: "160px",
        },
        {
          header: "Action",
          align: "center",
          width: "135px",
          cell: (row) => (
            <Button
              label="View Details"
              icon="eye"
              variant="outlined"
              size="small"
              onClick={() => onViewDetailsClick(row.orderNo)}
            />
          ),
        },
      ]}
    />
  );
}
