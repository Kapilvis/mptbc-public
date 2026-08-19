import React from "react";
import { Card } from "shared/components/panels";
import type { SupplyPipelineStage } from "../data";

interface Props {
  stages: SupplyPipelineStage[];
}

export const SupplyPipelineWidget: React.FC<Props> = ({ stages }) => {
  return (
    <Card className="mb-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 gap-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i className="pi pi-compass text-emerald-600 dark:text-emerald-400 text-lg" />
            Paper Tender & Supply Fulfillment Pipeline
          </h3>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
          83.8% Overall Fulfilled
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
        {stages.map((st, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-gray-700 dark:text-gray-200">
                Stage {idx + 1}: {st.stage}
              </span>
              <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                {st.percentage}%
              </span>
            </div>

            <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full ${st.color} rounded-full transition-all duration-500`}
                style={{ width: `${st.percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
              <span className="font-semibold">{st.statusText}</span>
              <span className="font-mono">
                {st.quantityMT.toLocaleString()} MT
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
