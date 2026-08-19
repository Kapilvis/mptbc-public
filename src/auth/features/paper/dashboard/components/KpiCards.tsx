import React from "react";
import { Card } from "shared/components/panels";
import type { PaperKpiMetric } from "../data";

interface Props {
  metrics: PaperKpiMetric[];
}

export const KpiCards: React.FC<Props> = ({ metrics }) => {
  const cardThemes = [
    {
      borderColor: "border-l-indigo-600",
      iconBg:
        "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50",
      accentText: "text-indigo-600 dark:text-indigo-400",
    },
    {
      borderColor: "border-l-blue-600",
      iconBg:
        "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50",
      accentText: "text-blue-600 dark:text-blue-400",
    },
    {
      borderColor: "border-l-emerald-600",
      iconBg:
        "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50",
      accentText: "text-emerald-600 dark:text-emerald-400",
    },
    {
      borderColor: "border-l-amber-600",
      iconBg:
        "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/50",
      accentText: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
      {metrics.map((m, idx) => {
        const theme = cardThemes[idx % cardThemes.length];

        return (
          <Card
            key={idx}
            className={`border-l-4 ${theme.borderColor} border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow`}
          >
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                  {m.title}
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {m.value}
                </div>
                <div
                  className={`mt-1 flex items-center gap-1.5 text-xs font-semibold ${theme.accentText}`}
                >
                  <i className={`${m.icon} text-[11px]`} />
                  <span>{m.subValue}</span>
                </div>
              </div>

              <div
                className={`w-12 h-12 rounded-2xl ${theme.iconBg} flex items-center justify-center border shrink-0`}
              >
                <i className={`${m.icon} text-xl`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
