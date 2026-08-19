import React from "react";
import { Card } from "shared/components/panels";
import type { SupplyPipelineStage } from "../data";

interface Props {
  stages: SupplyPipelineStage[];
}

export const SupplyPipelineWidget: React.FC<Props> = ({ stages }) => {
  return (
    <Card className="mb-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100 dark:border-emerald-800/50">
            <i className="pi pi-compass text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              Paper Procurement & Supply Chain Pipeline
            </h3>
          </div>
        </div>
        <span className="text-xs font-extrabold px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800 shrink-0">
          84.0% Shipped | 75.7% Stocked
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
        {stages.map((st, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {idx + 1}. {st.stage}
              </span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">
                {st.percentage}%
              </span>
            </div>

            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full ${st.color} rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(100, st.percentage)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-medium">{st.statusText}</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {st.quantityMT.toLocaleString()} MT
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
