import React from "react";
import { LIFECYCLE_STAGES } from "../data/adminDashboardData";

export const AdminSupplyChainTracker: React.FC = () => {
  const stageColors: Record<number, { barColor: string; textColor: string }> = {
    1: { barColor: "#059669", textColor: "#047857" },
    2: { barColor: "#0284c7", textColor: "#0369a1" },
    3: { barColor: "#d97706", textColor: "#b45309" },
    4: { barColor: "#7c3aed", textColor: "#6d28d9" },
    5: { barColor: "#db2777", textColor: "#be185d" },
  };

  return (
    <div className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary-light-bg)] text-[var(--primary-color)]">
            <i className="pi pi-sitemap text-base" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              End-to-End Supply Chain Lifecycle Tracker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Unified real-time throughput status from raw paper supply to final
              school distribution
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <i className="pi pi-check-circle text-sm" aria-hidden="true" />
          Overall Fulfillment: 72.8%
        </div>
      </div>

      {/* 5-Stage Stepper Pipeline - Clean White Cards + Multi-colored Progress Bars */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
        {LIFECYCLE_STAGES.map((stage) => {
          const theme = stageColors[stage.stepNumber] || stageColors[1];

          return (
            <div
              key={stage.stepNumber}
              className="relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-850"
            >
              {/* Stage Header Title & % */}
              <div className="mb-2 flex items-center justify-between gap-2">
                <span
                  className="text-[11px] font-extrabold uppercase tracking-wider leading-tight"
                  style={{ color: theme.textColor }}
                >
                  {stage.title}
                </span>
                <span
                  className="text-xs font-black"
                  style={{ color: theme.barColor }}
                >
                  {stage.percentage}%
                </span>
              </div>

              {/* Progress Bar with Stage Specific Color */}
              <div className="mb-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stage.percentage}%`,
                    backgroundColor: theme.barColor,
                  }}
                />
              </div>

              {/* Detail Info */}
              <p className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-400">
                {stage.detailText}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSupplyChainTracker;
