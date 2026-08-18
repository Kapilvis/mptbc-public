import React from "react";
import { Card } from "shared/components/panels";
import type { PaperKpiMetric } from "../data";

interface Props {
  metrics: PaperKpiMetric[];
}

export const KpiCards: React.FC<Props> = ({ metrics }) => {
  const getThemeClasses = (type: PaperKpiMetric["badgeType"]) => {
    switch (type) {
      case "info":
        return {
          iconBg:
            "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
          textPrimary: "text-indigo-950 dark:text-indigo-100",
          accentText: "text-indigo-700 dark:text-indigo-400",
        };
      case "success":
        return {
          iconBg:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
          textPrimary: "text-blue-950 dark:text-blue-100",
          accentText: "text-blue-700 dark:text-blue-400",
        };
      case "warning":
        return {
          iconBg:
            "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
          textPrimary: "text-amber-950 dark:text-amber-100",
          accentText: "text-amber-700 dark:text-amber-400",
        };
      case "danger":
      default:
        return {
          iconBg:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
          textPrimary: "text-emerald-950 dark:text-emerald-100",
          accentText: "text-emerald-700 dark:text-emerald-400",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((m, idx) => {
        const theme = getThemeClasses(m.badgeType);

        return (
          <Card
            key={idx}
            className="relative overflow-hidden transition-all duration-200 hover:shadow-md"
          >
            <div className="p-3 flex items-center gap-3.5">
              {/* Left Side Icon Badge Circle matching Distribution Dashboard */}
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
                    className={`text-2xl font-extrabold tracking-tight ${theme.textPrimary} font-mono`}
                  >
                    {m.value}
                  </span>
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="truncate">{m.subValue}</span>
                  <span className={`font-bold ${theme.accentText} shrink-0`}>
                    {m.badgeText}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
