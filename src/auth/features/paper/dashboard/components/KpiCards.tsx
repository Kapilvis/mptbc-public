import React from "react";
import { Card } from "shared/components/panels";
import type { PaperKpiMetric } from "../data";

interface Props {
  metrics: PaperKpiMetric[];
}

export const KpiCards: React.FC<Props> = ({ metrics }) => {
  const cardThemes = [
    {
      cardBg:
        "bg-indigo-50/70 border-indigo-100/90 dark:bg-indigo-950/20 dark:border-indigo-900/40",
      iconBg:
        "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
      textPrimary: "text-indigo-950 dark:text-indigo-100",
      accentText: "text-indigo-700 dark:text-indigo-400",
    },
    {
      cardBg:
        "bg-blue-50/70 border-blue-100/90 dark:bg-blue-950/20 dark:border-blue-900/40",
      iconBg:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
      textPrimary: "text-blue-950 dark:text-blue-100",
      accentText: "text-blue-700 dark:text-blue-400",
    },
    {
      cardBg:
        "bg-emerald-50/70 border-emerald-100/90 dark:bg-emerald-950/20 dark:border-emerald-900/40",
      iconBg:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
      textPrimary: "text-emerald-950 dark:text-emerald-100",
      accentText: "text-emerald-700 dark:text-emerald-400",
    },
    {
      cardBg:
        "bg-amber-50/70 border-amber-100/90 dark:bg-amber-950/20 dark:border-amber-900/40",
      iconBg:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
      textPrimary: "text-amber-950 dark:text-amber-100",
      accentText: "text-amber-700 dark:text-amber-400",
    },
    {
      cardBg:
        "bg-purple-50/70 border-purple-100/90 dark:bg-purple-950/20 dark:border-purple-900/40",
      iconBg:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
      textPrimary: "text-purple-950 dark:text-purple-100",
      accentText: "text-purple-700 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5 mb-6">
      {metrics.map((m, idx) => {
        const theme = cardThemes[idx % cardThemes.length];

        return (
          <Card
            key={idx}
            className={`relative overflow-hidden border ${theme.cardBg} transition-all duration-200 hover:shadow-md min-h-[125px] flex flex-col justify-between`}
          >
            <div className="p-3.5 flex flex-col justify-between h-full flex-1 gap-2">
              {/* Header: Icon Circle */}
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg} shadow-xs`}
                >
                  <i className={`${m.icon} text-base`} />
                </div>

                {m.badgeText && (
                  <span
                    className={`font-black text-[10px] uppercase tracking-wide ${theme.accentText} px-1.5 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800`}
                  >
                    {m.badgeText}
                  </span>
                )}
              </div>

              {/* Title & Value */}
              <div className="mt-1">
                <span className="text-xs sm:text-[12px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 block leading-tight mb-1 whitespace-normal">
                  {m.title}
                </span>

                <div className="flex items-baseline justify-between gap-1">
                  <span
                    className={`text-xl sm:text-[22px] font-black tracking-tight ${theme.textPrimary}`}
                  >
                    {m.value}
                  </span>
                </div>

                {m.subValue && (
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mt-0.5">
                    {m.subValue}
                  </span>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
