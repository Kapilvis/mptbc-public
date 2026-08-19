import React from "react";
import { EXECUTIVE_KPIS } from "../data/adminDashboardData";

export const AdminKpiBanner: React.FC<{ academicYear?: string }> = ({
  academicYear = "2026-2027",
}) => {
  const cardThemes: Record<
    string,
    {
      bgColor: string;
      borderColor: string;
      iconBg: string;
      badgeBg: string;
      badgeText: string;
    }
  > = {
    paper: {
      bgColor: "#f0fdf4",
      borderColor: "#bbf7d0",
      iconBg: "#059669",
      badgeBg: "#d1fae5",
      badgeText: "#047857",
    },
    depot: {
      bgColor: "#fffbeb",
      borderColor: "#fde68a",
      iconBg: "#d97706",
      badgeBg: "#fef3c7",
      badgeText: "#b45309",
    },
    printing: {
      bgColor: "#eff6ff",
      borderColor: "#bfdbfe",
      iconBg: "#2563eb",
      badgeBg: "#dbeafe",
      badgeText: "#1e40af",
    },
    district: {
      bgColor: "#f5f3ff",
      borderColor: "#ddd6fe",
      iconBg: "#7c3aed",
      badgeBg: "#ede9fe",
      badgeText: "#5b21b6",
    },
    demand: {
      bgColor: "#f0f9ff",
      borderColor: "#bae6fd",
      iconBg: "#0284c7",
      badgeBg: "#e0f2fe",
      badgeText: "#075985",
    },
  };

  const kpis = EXECUTIVE_KPIS.map((kpi) => {
    if (academicYear === "2025-2026") {
      if (kpi.id === "paper")
        return {
          ...kpi,
          value: "3,520 MT",
          badge: "98.5% Fulfilled",
          badgeType: "success" as const,
        };
      if (kpi.id === "depot")
        return {
          ...kpi,
          value: "3,480 MT",
          badge: "100% Inspected",
          badgeType: "success" as const,
        };
      if (kpi.id === "printing")
        return {
          ...kpi,
          value: "3.42 Cr",
          badge: "100% Completed",
          badgeType: "success" as const,
        };
      if (kpi.id === "district")
        return {
          ...kpi,
          value: "3.38 Cr",
          badge: "99.2% Dispatched",
          badgeType: "success" as const,
        };
      if (kpi.id === "demand")
        return {
          ...kpi,
          value: "3.45 Cr",
          badge: "100% Approved",
          badgeType: "success" as const,
        };
    } else if (academicYear === "2024-2025") {
      if (kpi.id === "paper")
        return {
          ...kpi,
          value: "3,210 MT",
          badge: "100% Archived",
          badgeType: "neutral" as const,
        };
      if (kpi.id === "depot")
        return {
          ...kpi,
          value: "3,210 MT",
          badge: "Closed",
          badgeType: "neutral" as const,
        };
      if (kpi.id === "printing")
        return {
          ...kpi,
          value: "3.18 Cr",
          badge: "Archived",
          badgeType: "neutral" as const,
        };
      if (kpi.id === "district")
        return {
          ...kpi,
          value: "3.18 Cr",
          badge: "100% Distributed",
          badgeType: "neutral" as const,
        };
      if (kpi.id === "demand")
        return {
          ...kpi,
          value: "3.20 Cr",
          badge: "Archived",
          badgeType: "neutral" as const,
        };
    }
    return kpi;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {kpis.map((kpi) => {
        const style = cardThemes[kpi.id] || cardThemes.paper;

        return (
          <div
            key={kpi.id}
            className="group relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
            style={{
              backgroundColor: style.bgColor,
              border: `1.5px solid ${style.borderColor}`,
            }}
          >
            {/* Background Watermark Icon */}
            <i
              className={`${kpi.icon} absolute -bottom-3 -right-3 text-7xl opacity-[0.07] pointer-events-none transition-transform duration-300 group-hover:scale-110`}
              style={{ color: style.iconBg }}
              aria-hidden="true"
            />

            {/* Top Row: Title & Badge */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <span className="text-[11.5px] font-bold uppercase tracking-wider leading-tight text-slate-800 dark:text-white">
                {kpi.title}
              </span>
              <span
                className="inline-flex items-center rounded-lg px-2 py-0.5 text-[10.5px] font-bold shadow-2xs shrink-0"
                style={{
                  backgroundColor: style.badgeBg,
                  color: style.badgeText,
                }}
              >
                {kpi.badgeText}
              </span>
            </div>

            {/* Main Primary Metric & Subtitle - Clean Crisp Text */}
            <div className="flex items-center justify-between gap-2 mt-1">
              <div>
                <div className="text-xl font-semibold tracking-normal leading-snug text-slate-900 dark:text-white">
                  {kpi.primaryValue}
                </div>
                <p className="mt-1 text-[12px] font-medium text-slate-600 dark:text-slate-300">
                  {kpi.secondaryValue}
                </p>
              </div>

              {/* Bold Vibrant Icon Button */}
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white text-lg shadow-md shrink-0 transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: style.iconBg }}
              >
                <i className={kpi.icon} aria-hidden="true" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminKpiBanner;
