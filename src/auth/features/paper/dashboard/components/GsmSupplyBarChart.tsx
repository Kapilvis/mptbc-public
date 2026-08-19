import React from "react";
import type { GsmSupplyMetric } from "../data";

interface Props {
  data: GsmSupplyMetric[];
}

export const GsmSupplyBarChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs h-full flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 pb-3 border-b border-slate-200/80 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100 dark:border-emerald-800/50">
              <i className="pi pi-chart-bar text-sm" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                GSM-wise Allocation vs Dispatched Quantity
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
              Ordered Target (100%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
              Dispatched MT
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {data.map((item, idx) => {
            const fulfillmentPct =
              item.orderedMT > 0
                ? Math.min(100, (item.suppliedMT / item.orderedMT) * 100)
                : 0;

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.gsmType}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {fulfillmentPct.toFixed(1)}% Supplied
                    </span>
                  </div>
                  <span className="font-mono text-slate-600 dark:text-slate-400 font-extrabold">
                    {item.suppliedMT.toLocaleString()} /{" "}
                    {item.orderedMT.toLocaleString()} MT
                  </span>
                </div>

                <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  {/* Ordered Target bar (100% capacity) */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: "100%" }}
                    />
                  </div>
                  {/* Dispatched MT progress bar (relative to Ordered MT) */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${fulfillmentPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
