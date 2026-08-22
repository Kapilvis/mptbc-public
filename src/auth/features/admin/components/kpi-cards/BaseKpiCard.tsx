import React from "react";
import type { LucideIcon } from "lucide-react";

export interface BaseKpiCardProps {
  title: string;
  badge?: string;
  theme:
    | "blue"
    | "green"
    | "orange"
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
    iconBg: "bg-blue-100 text-blue-700",
    cardBg: "bg-blue-50 border-blue-200",
  },
  green: {
    iconBg: "bg-emerald-100 text-emerald-700",
    cardBg: "bg-emerald-50 border-emerald-200",
  },
  orange: {
    iconBg: "bg-orange-100 text-orange-700",
    cardBg: "bg-orange-50 border-orange-200",
  },
  purple: {
    iconBg: "bg-purple-100 text-purple-700",
    cardBg: "bg-purple-50 border-purple-200",
  },
  violet: {
    iconBg: "bg-violet-100 text-violet-700",
    cardBg: "bg-violet-50 border-violet-200",
  },
  teal: {
    iconBg: "bg-teal-100 text-teal-700",
    cardBg: "bg-teal-50 border-teal-200",
  },
  indigo: {
    iconBg: "bg-indigo-100 text-indigo-700",
    cardBg: "bg-indigo-50 border-indigo-200",
  },
  red: {
    iconBg: "bg-red-100 text-red-700",
    cardBg: "bg-red-50 border-red-200",
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
  const styles = themeStyles[theme];

  return (
    <div
      className={`relative flex flex-col rounded-[10px] border ${styles.cardBg} p-4 shadow-sm transition-shadow h-full`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`p-1.5 rounded-lg ${styles.iconBg}`}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
          <h3
            className={`font-black text-black uppercase tracking-wide text-sm sm:text-[15px] leading-tight`}
          >
            {title}
          </h3>
          {badge && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-white text-black border border-black/10 shadow-2xs tracking-wide">
              {badge}
            </span>
          )}
        </div>
        {onView && (
          <button
            onClick={onView}
            className="text-xs font-semibold px-3 py-1 rounded bg-white shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600"
          >
            View Details
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
  <div className="flex justify-between items-center py-2 border-b border-black/10 last:border-0">
    <span className="text-xs font-black text-black uppercase tracking-wide flex items-center gap-2">
      {label}
    </span>
    <span className="text-sm sm:text-[15px] font-black text-black">
      {value}
    </span>
  </div>
);
