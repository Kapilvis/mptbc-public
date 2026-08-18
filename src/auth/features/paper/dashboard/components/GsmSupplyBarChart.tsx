import React from "react";
import type { GsmSupplyMetric } from "../data";

interface Props {
  data: GsmSupplyMetric[];
}

export const GsmSupplyBarChart: React.FC<Props> = ({ data }) => {
  const maxVal =
    Math.max(...data.map((d) => Math.max(d.orderedMT, d.suppliedMT))) * 1.1;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i className="pi pi-chart-bar text-emerald-600 dark:text-emerald-400" />
            GSM-wise Allocation vs Dispatched Quantity
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Comparison of total ordered Metric Tonnes against dispatched
            quantity by GSM paper type.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
            Ordered MT
          </span>
          <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
            <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
            Dispatched MT
          </span>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {data.map((item, idx) => {
          const orderedWidth = (item.orderedMT / maxVal) * 100;
          const suppliedWidth = (item.suppliedMT / maxVal) * 100;

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-200">
                <span>{item.gsmType}</span>
                <span className="font-mono text-gray-500">
                  {item.suppliedMT.toLocaleString()} /{" "}
                  {item.orderedMT.toLocaleString()} MT
                </span>
              </div>

              <div className="space-y-1 bg-gray-50 dark:bg-gray-800/80 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                {/* Ordered bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${orderedWidth}%` }}
                  />
                </div>
                {/* Supplied bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${suppliedWidth}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
