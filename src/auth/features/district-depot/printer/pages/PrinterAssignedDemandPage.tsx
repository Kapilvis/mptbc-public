import { useState } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card, GridPanel } from "shared/components/panels";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import { printerDemandData, type PrinterDemandItem } from "../data";

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 100 : Math.min(Math.round((value / max) * 100), 100);
  const color =
    pct === 100 ? "bg-emerald-500" : pct >= 70 ? "bg-blue-500" : "bg-rose-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 w-8 text-right">
        {pct}%
      </span>
    </div>
  );
}

export default function PrinterAssignedDemandPage() {
  const pageTitle = usePageTitle();
  const [academicYear, setAcademicYear] = useState("2026-2027");

  const totals = printerDemandData.reduce(
    (acc, r) => ({
      ordered: acc.ordered + r.totalOrdered,
      delivered: acc.delivered + r.deliveredToDepot,
      remaining: acc.remaining + r.remaining,
    }),
    { ordered: 0, delivered: 0, remaining: 0 },
  );

  return (
    <Page
      header={pageTitle || "Printer Assigned Demand"}
      subHeader="मुद्रक-वार कार्यादेश — Books ordered from each printer, delivered to depot, and remaining balance."
      showHeaderActions
    >
      {/* 1. Academic Session Filter Bar */}
      <AcademicYearFilterBar
        academicYear={academicYear}
        onChange={setAcademicYear}
        subtitle={`Printer-wise book allocation and depot delivery status for session ${academicYear}.`}
      />

      {/* 2. Redesigned Premium KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {/* KPI 1: Total Books Ordered */}
        <Card className="border-l-4 border-l-indigo-600 border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Total Books Ordered
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {totals.ordered.toLocaleString()}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600 font-semibold">
                <i className="pi pi-check-circle text-[11px]" />
                <span>All Printer Allocation Orders</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/50 shrink-0">
              <i className="pi pi-book text-xl" />
            </div>
          </div>
        </Card>

        {/* KPI 2: Delivered to Depot */}
        <Card className="border-l-4 border-l-emerald-600 border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Delivered to Depot
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {totals.delivered.toLocaleString()}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <i className="pi pi-truck text-[11px]" />
                <span>
                  {Math.round((totals.delivered / (totals.ordered || 1)) * 100)}
                  % Fulfilled & Received
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50 shrink-0">
              <i className="pi pi-inbox text-xl" />
            </div>
          </div>
        </Card>

        {/* KPI 3: Remaining Balance */}
        <Card className="border-l-4 border-l-amber-500 border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Remaining Balance
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {totals.remaining.toLocaleString()}
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                <i className="pi pi-clock text-[11px]" />
                <span>
                  {Math.round((totals.remaining / (totals.ordered || 1)) * 100)}
                  % Pending Delivery
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-800/50 shrink-0">
              <i className="pi pi-history text-xl" />
            </div>
          </div>
        </Card>
      </div>

      {/* 3. Grid Card with Shared GridPanel */}
      <Card className="border border-slate-100 p-1 shadow-xs">
        <GridPanel<PrinterDemandItem>
          toolbarPlacement="page"
          data={printerDemandData}
          searchBox={true}
          searchPlaceholder="Search printer name..."
          exportFilename="printer_assigned_demand.xls"
          columns={[
            {
              header: "S.No.",
              cell: (_, opt) => (
                <span className="text-gray-500 font-medium">
                  {opt.rowIndex + 1}
                </span>
              ),
              width: "60px",
              align: "center",
            },
            {
              field: "printerName",
              header: "Printer Name",
              cell: (row) => (
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {row.printerName}
                </span>
              ),
              sortable: true,
            },
            {
              field: "totalOrdered",
              header: "Total Ordered",
              align: "center",
              cell: (row) => (
                <span className="font-bold text-indigo-700 dark:text-indigo-400">
                  {row.totalOrdered.toLocaleString()}
                </span>
              ),
              sortable: true,
            },
            {
              field: "deliveredToDepot",
              header: "Delivered to Depot",
              align: "center",
              cell: (row) => (
                <span className="font-bold text-blue-700 dark:text-blue-400">
                  {row.deliveredToDepot.toLocaleString()}
                </span>
              ),
              sortable: true,
            },
            {
              field: "remaining",
              header: "Remaining",
              align: "center",
              cell: (row) => (
                <span className="font-bold text-amber-700 dark:text-amber-400">
                  {row.remaining.toLocaleString()}
                </span>
              ),
              sortable: true,
            },
            {
              header: "% Complete",
              cell: (row) => (
                <ProgressBar
                  value={row.deliveredToDepot}
                  max={row.totalOrdered}
                />
              ),
            },
            {
              field: "lastDeliveryDate",
              header: "Last Delivery",
              sortable: true,
              align: "center",
            },
          ]}
        />
      </Card>
    </Page>
  );
}
