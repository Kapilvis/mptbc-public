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
      case 6:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
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
            className={`relative overflow-hidden border ${theme.cardBg} transition-all duration-200 hover:shadow-md border-t-transparent! min-h-[140px] flex flex-col justify-between`}
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${theme.topLine}`}
            />
            <div className="p-3.5 flex flex-col justify-between h-full flex-1 gap-2">
              {/* Top Header Row: Icon + Top-Right Percentage Badge (Image 2 Style) */}
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg} shadow-xs`}
                >
                  <i className={`${m.icon} text-lg`} />
                </div>

                {m.percentBadge && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${
                      m.percentBadgeTheme ||
                      "bg-indigo-50 text-indigo-700 border-indigo-200/80"
                    } uppercase tracking-tight shrink-0 text-right`}
                  >
                    {m.percentBadge}
                  </span>
                )}
              </div>

              {/* Card Body: Title & Big Number */}
              <div className="mt-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 block leading-tight mb-1 whitespace-normal">
                  {m.title}
                </span>

                <span
                  className={`text-xl sm:text-2xl font-black tracking-tight ${theme.textPrimary} block leading-none`}
                >
                  {m.value}
                </span>

                {m.subText && (
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block mt-1">
                    {m.subText}
                  </span>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
