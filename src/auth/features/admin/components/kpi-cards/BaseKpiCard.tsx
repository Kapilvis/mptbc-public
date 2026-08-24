import React from "react";
import type { LucideIcon } from "lucide-react";

export interface BaseKpiCardProps {
  title: string;
  badge?: string;
  theme:
    | "blue"
    | "green"
    | "orange"
    | "amber"
    | "purple"
    | "teal"
    | "indigo"
    | "red"
    | "violet";
  icon: LucideIcon;
  onView?: () => void;
  children: React.ReactNode;
}

const themeStyles = {
  blue: {
    iconBg: "bg-blue-50 text-blue-600 border border-blue-100",
    accentBorder: "border-t-2 border-t-blue-500",
    badgeBg: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  green: {
    iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
    accentBorder: "border-t-2 border-t-emerald-500",
    badgeBg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  orange: {
    iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
    accentBorder: "border-t-2 border-t-amber-500",
    badgeBg: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  amber: {
    iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
    accentBorder: "border-t-2 border-t-amber-500",
    badgeBg: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  purple: {
    iconBg: "bg-purple-50 text-purple-600 border border-purple-100",
    accentBorder: "border-t-2 border-t-purple-500",
    badgeBg: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  violet: {
    iconBg: "bg-violet-50 text-violet-600 border border-violet-100",
    accentBorder: "border-t-2 border-t-violet-500",
    badgeBg: "bg-violet-50 text-violet-700 border border-violet-200",
  },
  teal: {
    iconBg: "bg-teal-50 text-teal-600 border border-teal-100",
    accentBorder: "border-t-2 border-t-teal-500",
    badgeBg: "bg-teal-50 text-teal-700 border border-teal-200",
  },
  indigo: {
    iconBg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
    accentBorder: "border-t-2 border-t-indigo-500",
    badgeBg: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  },
  red: {
    iconBg: "bg-rose-50 text-rose-600 border border-rose-100",
    accentBorder: "border-t-2 border-t-rose-500",
    badgeBg: "bg-rose-50 text-rose-700 border border-rose-200",
  },
};

export const BaseKpiCard: React.FC<BaseKpiCardProps> = ({
  title,
  badge,
  theme,
  icon: Icon,
  onView,
  children,
}) => {
  const styles = themeStyles[theme] || themeStyles.blue;

  return (
    <div
      className={`relative flex flex-col rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full ${styles.accentBorder}`}
    >
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`p-1.5 rounded-lg ${styles.iconBg}`}>
            <Icon size={17} strokeWidth={2.2} />
          </div>
          <h3 className="font-bold text-slate-800 uppercase tracking-wide text-xs sm:text-[13px] leading-tight">
            {title}
          </h3>
          {badge && (
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md tracking-wider ${styles.badgeBg}`}
            >
              {badge}
            </span>
          )}
        </div>
        {onView && (
          <button
            onClick={onView}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer shrink-0"
          >
            Details
          </button>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export const MetricRow: React.FC<{
  label: string;
  value: React.ReactNode;
}> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
    <span className="text-[12px] font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-2">
      {label}
    </span>
    <span className="text-[13px] sm:text-[14px] font-extrabold text-slate-900">
      {value}
    </span>
  </div>
);
