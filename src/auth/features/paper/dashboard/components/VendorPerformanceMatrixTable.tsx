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
    <Card>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i className="pi pi-building text-emerald-600 dark:text-emerald-400" />
            Paper Mill Vendor Supply Performance Matrix
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Consolidated agreement allocation vs actual paper dispatch
            performance across all empaneled paper mills.
          </p>
        </div>
      </div>

      <GridPanel<VendorPerformanceItem>
        toolbarPlacement="page"
        data={data}
        loading={loading}
        searchFields={["paperMillName", "vendorName", "academicYear", "status"]}
        columns={[
          {
            cell: (_, option) => <span>{option.rowIndex + 1}</span>,
            width: "50px",
            align: "center",
          },
          {
            field: "paperMillName",
            header: "PAPER MILL NAME",
            cell: (row) => (
              <div>
                <span className="font-bold text-gray-900 dark:text-white block">
                  {row.paperMillName}
                </span>
                <span className="text-[11px] text-gray-400 block font-mono">
                  {row.vendorName}
                </span>
              </div>
            ),
          },
          {
            field: "academicYear",
            header: "AGREEMENT YEAR",
            align: "center",
          },
          {
            field: "approvedTon",
            header: "APPROVED TENDER (MT)",
            align: "right",
            cell: (row) => (
              <span className="font-mono">{row.approvedTon.toFixed(2)} MT</span>
            ),
          },
          {
            field: "workOrderTon",
            header: "WORK ORDERS (MT)",
            align: "right",
            cell: (row) => (
              <span className="font-mono">
                {row.workOrderTon.toFixed(2)} MT
              </span>
            ),
          },
          {
            field: "suppliedTon",
            header: "SUPPLIED (MT)",
            align: "right",
            cell: (row) => (
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {row.suppliedTon.toFixed(2)} MT
              </span>
            ),
          },
          {
            field: "balanceTon",
            header: "BALANCE (MT)",
            align: "right",
            cell: (row) => (
              <span className="font-mono text-amber-600 dark:text-amber-400">
                {row.balanceTon.toFixed(2)} MT
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
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span>{row.fulfillmentPercent.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
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
                className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  row.status === "Completed"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-700"
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
