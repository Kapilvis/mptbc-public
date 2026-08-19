import React from "react";
import Grid from "shared/components/grid/Grid";
import {
  UNIFIED_ACTIVITY_TRAIL,
  type ActivityTrailItem,
} from "../data/adminDashboardData";

export const AdminActivityTrail: React.FC = () => {
  const getModuleBadge = (moduleName: string) => {
    switch (moduleName) {
      case "Paper Vendor":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Central Depot":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Printer Section":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "District Depot":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-sky-100 text-sky-800 border-sky-300";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmed":
      case "Verified":
        return "bg-emerald-100 text-emerald-800";
      case "In-Transit":
        return "bg-blue-100 text-blue-800";
      case "Issued":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-rose-100 text-rose-800";
    }
  };

  const columns: Controls.ColumnProps<ActivityTrailItem>[] = [
    {
      field: "timestamp",
      header: "Timestamp",
      width: "120px",
      cell: (item) => (
        <span className="font-semibold text-slate-500 dark:text-slate-400">
          {item.timestamp}
        </span>
      ),
    },
    {
      field: "module",
      header: "Module Login",
      width: "160px",
      cell: (item) => (
        <span
          className={`inline-flex rounded-md border px-2.5 py-0.5 text-[11px] font-extrabold ${getModuleBadge(
            item.module,
          )}`}
        >
          {item.module}
        </span>
      ),
    },
    {
      field: "event",
      header: "Transaction / Event",
      cell: (item) => (
        <span className="font-bold text-slate-900 dark:text-white">
          {item.event}
        </span>
      ),
    },
    {
      field: "entity",
      header: "Entity Involved",
      cell: (item) => (
        <span className="font-medium text-slate-600 dark:text-slate-400">
          {item.entity}
        </span>
      ),
    },
    {
      field: "volume",
      header: "Volume / Qty",
      cell: (item) => (
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {item.volume}
        </span>
      ),
    },
    {
      field: "status",
      header: "Status",
      align: "right",
      cell: (item) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-extrabold ${getStatusBadge(
            item.status,
          )}`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold text-sm">
            <i className="pi pi-history" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              Unified Cross-Module Audit & Activity Trail
            </h3>
          </div>
        </div>
      </div>

      {/* Shared Grid Component */}
      <div className="overflow-hidden rounded-xl border border-slate-200/70 dark:border-slate-800">
        <Grid<ActivityTrailItem>
          data={UNIFIED_ACTIVITY_TRAIL}
          columns={columns}
          paginator={false}
          rows={10}
        />
      </div>
    </div>
  );
};

export default AdminActivityTrail;
