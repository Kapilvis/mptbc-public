import React from "react";
import { EXECUTIVE_KPIS } from "../data/adminDashboardData";

const AnimatedCounter: React.FC<{
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}> = ({ target, duration = 1200, suffix = "", prefix = "" }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(easeOutQuad * target));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

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
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <span className="text-[13.5px] font-extrabold uppercase tracking-wider leading-tight text-slate-900 dark:text-white">
                {kpi.title}
              </span>
              <span
                className="inline-flex items-center rounded-lg px-2.5 py-1 text-[12.5px] font-black shadow-2xs shrink-0 whitespace-nowrap"
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
                {kpi.id === "demand" ? (
                  <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
                    <div className="flex flex-col">
                      <span className="text-[11.5px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                        Demand
                      </span>
                      <span className="text-base font-black sm:text-lg">
                        <AnimatedCounter target={450000} />
                      </span>
                    </div>
                    <span className="text-slate-300 font-normal px-0.5 text-base">
                      |
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[11.5px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                        Approved
                      </span>
                      <span className="text-base font-black sm:text-lg">
                        <AnimatedCounter target={390000} />
                      </span>
                    </div>
                  </div>
                ) : kpi.id === "paper" ? (
                  <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
                    <div className="flex flex-col">
                      <span className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                        Demand
                      </span>
                      <span className="text-base font-black sm:text-lg">
                        <AnimatedCounter target={3767} suffix=" MT" />
                      </span>
                    </div>
                    <span className="text-slate-300 font-normal px-0.5 text-base">
                      |
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[11.5px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                        Received
                      </span>
                      <span className="text-base font-black sm:text-lg">
                        <AnimatedCounter target={3165} suffix=" MT" />
                      </span>
                    </div>
                  </div>
                ) : kpi.id === "depot" ? (
                  <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
                    <div className="flex flex-col">
                      <span className="text-[11.5px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                        Received
                      </span>
                      <span className="text-base font-black sm:text-lg">
                        <AnimatedCounter target={3165} suffix=" MT" />
                      </span>
                    </div>
                    <span className="text-slate-300 font-normal px-0.5 text-base">
                      |
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[11.5px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                        Issue
                      </span>
                      <span className="text-base font-black sm:text-lg">
                        <AnimatedCounter target={2800} suffix=" MT" />
                      </span>
                    </div>
                  </div>
                ) : kpi.id === "printing" ? (
                  <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
                    <div className="flex flex-col">
                      <span className="text-[11.5px] font-black text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                        Target
                      </span>
                      <span className="text-base font-black sm:text-lg">
                        <AnimatedCounter target={390000} />
                      </span>
                    </div>
                    <span className="text-slate-300 font-normal px-0.5 text-base">
                      |
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[11.5px] font-black text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                        Dispatch
                      </span>
                      <span className="text-base font-black sm:text-lg">
                        <AnimatedCounter target={180500} />
                      </span>
                    </div>
                  </div>
                ) : kpi.id === "district" ? (
                  <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
                    <div className="flex flex-col">
                      <span className="text-[11.5px] font-black text-purple-800 dark:text-purple-300 uppercase tracking-wider">
                        Received
                      </span>
                      <span className="text-base font-black sm:text-lg">
                        <AnimatedCounter target={180500} />
                      </span>
                    </div>
                    <span className="text-slate-300 font-normal px-0.5 text-base">
                      |
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[11.5px] font-black text-purple-800 dark:text-purple-300 uppercase tracking-wider">
                        Dispatch
                      </span>
                      <span className="text-base font-black sm:text-lg">
                        <AnimatedCounter target={150000} />
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-2xl font-black tracking-tight leading-snug text-slate-950 dark:text-white">
                    {kpi.primaryValue}
                  </div>
                )}
                <p className="mt-1 text-[13.5px] font-bold text-slate-700 dark:text-slate-200">
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
