import { Card } from "shared/components/panels";
import type { KpiMetric } from "../data";

interface KpiCardsProps {
  metrics: KpiMetric[];
}

export function KpiCards({ metrics }: KpiCardsProps) {
  const getThemeClasses = (theme: KpiMetric["theme"]) => {
    switch (theme) {
      case "indigo":
        return {
          cardBg:
            "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800",
          topLine: "bg-indigo-500",
          iconBg:
            "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50",
          textTitle: "text-slate-700 dark:text-slate-200",
          textPrimary: "text-slate-900 dark:text-white",
          accentText: "text-indigo-600 dark:text-indigo-400",
        };
      case "blue":
        return {
          cardBg:
            "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800",
          topLine: "bg-blue-500",
          iconBg:
            "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50",
          textTitle: "text-slate-700 dark:text-slate-200",
          textPrimary: "text-slate-900 dark:text-white",
          accentText: "text-blue-600 dark:text-blue-400",
        };
      case "amber":
        return {
          cardBg:
            "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800",
          topLine: "bg-amber-500",
          iconBg:
            "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50",
          textTitle: "text-slate-700 dark:text-slate-200",
          textPrimary: "text-slate-900 dark:text-white",
          accentText: "text-amber-600 dark:text-amber-400",
        };
      case "emerald":
      default:
        return {
          cardBg:
            "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800",
          topLine: "bg-emerald-500",
          iconBg:
            "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50",
          textTitle: "text-slate-700 dark:text-slate-200",
          textPrimary: "text-slate-900 dark:text-white",
          accentText: "text-emerald-600 dark:text-emerald-400",
        };
    }
  };

  const getGridColsClass = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      case 3:
        return "grid-cols-1 sm:grid-cols-3 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
      case 5:
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5";
    }
  };

  return (
    <div className={`grid ${getGridColsClass(metrics.length)} gap-3.5 mb-6`}>
      {metrics.map((m, idx) => {
        const theme = getThemeClasses(m.theme);

        return (
          <Card
            key={idx}
            className={`relative overflow-hidden border ${theme.cardBg} transition-all duration-200 hover:shadow-md border-t-transparent!`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 ${theme.topLine}`} />
            <div className="p-4 flex items-center gap-3.5">
              {/* Left Side Icon Badge Circle (Image 1 Style) */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg} shadow-xs`}
              >
                <i className={`${m.icon} text-xl`} />
              </div>

              {/* Metric Content */}
              <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 block truncate mb-1">
                  {m.title}
                </span>

                {m.stats && m.stats.length > 0 ? (
                  <div className="flex items-center gap-2.5 mt-1">
                    {m.stats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        {i > 0 && (
                          <span className="text-gray-300 dark:text-gray-600 font-normal text-base">
                            |
                          </span>
                        )}
                        <div className="flex flex-col">
                          <span
                            className={`text-[10.5px] font-black uppercase tracking-wider ${theme.accentText}`}
                          >
                            {stat.label}
                          </span>
                          <span
                            className={`text-base sm:text-lg font-black tracking-tight ${theme.textPrimary}`}
                          >
                            {stat.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : m.secondaryValue ? (
                  <div className="flex items-center gap-2.5 mt-1">
                    <div className="flex flex-col">
                      <span
                        className={`text-[11px] font-black uppercase tracking-wider ${theme.accentText}`}
                      >
                        {m.title.toLowerCase().includes("stock")
                          ? "Stock"
                          : m.title.toLowerCase().includes("allotment")
                            ? "Received"
                            : m.title.toLowerCase().includes("dispatch")
                              ? "Dispatched"
                              : "Demand"}
                      </span>
                      <span
                        className={`text-lg sm:text-xl font-black tracking-tight ${theme.textPrimary}`}
                      >
                        {m.value}
                      </span>
                    </div>
                    <span className="text-gray-300 dark:text-gray-600 font-normal text-base px-0.5">
                      |
                    </span>
                    <div className="flex flex-col">
                      <span
                        className={`text-[11px] font-black uppercase tracking-wider ${theme.accentText}`}
                      >
                        {m.secondaryTitle || "Remaining"}
                      </span>
                      <span
                        className={`text-lg sm:text-xl font-black tracking-tight ${theme.textPrimary}`}
                      >
                        {m.secondaryValue}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-between gap-1 mt-0.5">
                    <span
                      className={`text-2xl sm:text-3xl font-black tracking-tight ${theme.textPrimary}`}
                    >
                      {m.value}
                    </span>

                    {m.trend && (
                      <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <i className="pi pi-arrow-up-right mr-0.5" />
                        {m.trend}
                      </span>
                    )}
                  </div>
                )}

                {(Boolean(m.subText) || Boolean(m.badgeText)) && (
                  <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                    {m.subText ? <span className="truncate">{m.subText}</span> : <span />}
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
}
