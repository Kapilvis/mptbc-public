import React from "react";
import { useNavigate } from "react-router-dom";
import { EXECUTIVE_ALERTS } from "../data/adminDashboardData";

export const AdminActionCenter: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-5 rounded-xl border border-rose-200/60 bg-rose-50/20 p-5 shadow-xs dark:border-rose-900/30 dark:bg-rose-950/10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
            <i
              className="pi pi-exclamation-triangle text-base"
              aria-hidden="true"
            />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              System Executive Action Center (Consolidated Alerts)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-priority operational alerts requiring immediate executive
              sign-off or action
            </p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
          4 Critical Flags Need Approval
        </span>
      </div>

      {/* Grid of Alert Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {EXECUTIVE_ALERTS.map((alert) => {
          const borderClass =
            alert.severity === "danger"
              ? "border-rose-200 bg-white hover:border-rose-300 dark:border-rose-900/50 dark:bg-slate-900"
              : alert.severity === "warning"
                ? "border-amber-200 bg-white hover:border-amber-300 dark:border-amber-900/50 dark:bg-slate-900"
                : "border-blue-200 bg-white hover:border-blue-300 dark:border-blue-900/50 dark:bg-slate-900";

          const categoryBadge =
            alert.severity === "danger"
              ? "bg-rose-100 text-rose-800"
              : alert.severity === "warning"
                ? "bg-amber-100 text-amber-800"
                : "bg-blue-100 text-blue-800";

          return (
            <div
              key={alert.id}
              className={`flex flex-col justify-between rounded-xl border p-4 shadow-2xs transition-all duration-200 ${borderClass}`}
            >
              <div>
                {/* Module Tag & Category */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {alert.module}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-extrabold uppercase ${categoryBadge}`}
                  >
                    {alert.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {alert.title}
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-snug">
                  {alert.description}
                </p>
              </div>

              {/* Action Link Button */}
              <button
                type="button"
                onClick={() => navigate(alert.actionRoute)}
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <span>{alert.actionLabel}</span>
                <i
                  className="pi pi-arrow-right text-[11px]"
                  aria-hidden="true"
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminActionCenter;
