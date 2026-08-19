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
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((m, idx) => {
        const theme = cardThemes[idx % cardThemes.length];

        return (
          <Card
            key={idx}
            className={`relative overflow-hidden border ${theme.cardBg} transition-all duration-200 hover:shadow-md`}
          >
            <div className="p-4 flex items-center gap-3.5">
              {/* Left Side Icon Badge Circle */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg} shadow-xs`}
              >
                <i className={`${m.icon} text-xl`} />
              </div>

              {/* Metric Content */}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block truncate">
                  {m.title}
                </span>

                <div className="flex items-baseline justify-between gap-1 mt-0.5">
                  <span
                    className={`text-2xl font-extrabold tracking-tight ${theme.textPrimary}`}
                  >
                    {m.value}
                  </span>
                </div>

                {(Boolean(m.subValue) || Boolean(m.badgeText)) && (
                  <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                    {m.subValue ? <span className="truncate">{m.subValue}</span> : <span />}
                    {m.badgeText && (
                      <span className={`font-bold ${theme.accentText} shrink-0`}>
                        {m.badgeText}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
