import React from "react";
import { Card, GridPanel } from "shared/components/panels";
import type { VendorPerformanceItem } from "../data";

interface Props {
  data: VendorPerformanceItem[];
  loading?: boolean;
}

export const VendorPerformanceMatrixTable: React.FC<Props> = ({
  data,
  loading,
}) => {
  return (
    <Card className="border border-slate-100 p-1 shadow-xs">
      <GridPanel<VendorPerformanceItem>
        toolbarPlacement="page"
        data={data}
        loading={loading}
        searchBox={true}
        searchPlaceholder="Search mill name, vendor, status..."
        exportFilename="paper_vendor_performance_matrix.xls"
        columns={[
          {
            header: "S.NO.",
            cell: (_, option) => (
              <span className="text-slate-500 font-medium">
                {option.rowIndex + 1}
              </span>
            ),
            width: "60px",
            align: "center",
          },
          {
            field: "paperMillName",
            header: "PAPER MILL NAME",
            cell: (row) => (
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {row.paperMillName}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  {row.vendorName}
                </span>
              </div>
            ),
          },
          {
            field: "approvedTon",
            header: "APPROVED TENDER",
            align: "center",
            cell: (row) => (
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {row.approvedTon.toLocaleString()} MT
              </span>
            ),
          },
          {
            field: "workOrderTon",
            header: "WORK ORDERS",
            align: "center",
            cell: (row) => (
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {row.workOrderTon.toLocaleString()} MT
              </span>
            ),
          },
          {
            field: "suppliedTon",
            header: "SUPPLIED",
            cell: (row) => (
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {row.suppliedTon.toLocaleString()} MT
              </span>
            ),
          },
          {
            field: "balanceTon",
            header: "Available Stock",
            align: "center",
            cell: (row) => (
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {row.balanceTon.toLocaleString()} MT
              </span>
            ),
          },
          {
            field: "fulfillmentPercent",
            header: "FULFILLMENT %",
            align: "center",
            width: "160px",
            cell: (row) => (
              <div className="w-full space-y-1">
                <div className="flex items-center justify-center text-xs font-black text-slate-800 dark:text-slate-200">
                  <span>{row.fulfillmentPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      row.fulfillmentPercent >= 100
                        ? "bg-emerald-500"
                        : row.fulfillmentPercent >= 80
                          ? "bg-blue-500"
                          : "bg-amber-500"
                    }`}
                    style={{
                      width: `${Math.min(100, row.fulfillmentPercent)}%`,
                    }}
                  />
                </div>
              </div>
            ),
          },
          {
            field: "status",
            header: "STATUS",
            align: "center",
            cell: (row) => (
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${
                  row.status === "Completed"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-700"
                }`}
              >
                {row.status}
              </span>
            ),
          },
        ]}
      />
    </Card>
  );
};
