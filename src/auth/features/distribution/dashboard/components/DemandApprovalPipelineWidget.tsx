import { useState } from "react";
import { Card } from "shared/components/panels";

interface DonutSlice {
  label: string;
  percent: number;
  offset: number;
  count: string;
  color: string;
}

interface AgencyDemandData {
  id: string;
  name: string;
  badge: string;
  totalDemand: string;
  approvedCount: string;
  pendingCount: string;
  approvedPercent: number;
  slices: DonutSlice[];
}

export function DemandApprovalPipelineWidget() {
  const [hoveredSlice, setHoveredSlice] = useState<{
    agencyId: string;
    idx: number;
  } | null>(null);

  const radius = 38;
  const circumference = 2 * Math.PI * radius; // 238.76

  const agencies: AgencyDemandData[] = [
    {
      id: "rsk",
      name: "RSK",
      badge: "Classes 1-8",
      totalDemand: "3,10,000 Units",
      approvedCount: "2,75,000 Units",
      pendingCount: "35,000 Units",
      approvedPercent: 89,
      slices: [
        {
          label: "Approved Demand",
          percent: 89,
          offset: 0,
          count: "2,75,000 Units",
          color: "#059669", // Emerald
        },
        {
          label: "Pending Queue",
          percent: 11,
          offset: 89,
          count: "35,000 Units",
          color: "#f59e0b", // Amber
        },
      ],
    },
    {
      id: "cpi",
      name: "CPI",
      badge: "High School 9-12",
      totalDemand: "1,40,000 Units",
      approvedCount: "1,15,000 Units",
      pendingCount: "25,000 Units",
      approvedPercent: 82,
      slices: [
        {
          label: "Approved Demand",
          percent: 82,
          offset: 0,
          count: "1,15,000 Units",
          color: "#0d9488", // Teal
        },
        {
          label: "Pending Queue",
          percent: 18,
          offset: 82,
          count: "25,000 Units",
          color: "#f59e0b", // Amber
        },
      ],
    },
  ];

  return (
    <Card className="mb-6 p-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
            <i className="pi pi-check-square" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Demand Approval Status
            </h3>
          </div>
        </div>
        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 shadow-2xs">
          Overall Approved: 3,90,000 / 4,50,000 (86.7%)
        </span>
      </div>

      {/* Two Donut Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agencies.map((agency) => {
          const activeItem =
            hoveredSlice?.agencyId === agency.id
              ? agency.slices[hoveredSlice.idx]
              : null;

          return (
            <div
              key={agency.id}
              className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 flex flex-col justify-between"
            >
              {/* Agency Title */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/50 dark:border-slate-700/50">
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {agency.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 shrink-0">
                  {agency.badge}
                </span>
              </div>

              {/* Chart & Legend Row */}
              <div className="flex items-center justify-around gap-4 py-2">
                {/* 100% Full Circle SVG Donut */}
                <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full -rotate-90 transform transition-all duration-300"
                  >
                    {agency.slices.map((slice, idx) => {
                      const strokeDasharray = `${(slice.percent / 100) * circumference} ${circumference}`;
                      const strokeDashoffset = -(
                        (slice.offset / 100) *
                        circumference
                      );
                      const isHovered =
                        hoveredSlice?.agencyId === agency.id &&
                        hoveredSlice?.idx === idx;

                      return (
                        <circle
                          key={idx}
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke={slice.color}
                          strokeWidth={isHovered ? 17 : 13}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          onMouseEnter={() =>
                            setHoveredSlice({ agencyId: agency.id, idx })
                          }
                          onMouseLeave={() => setHoveredSlice(null)}
                          className="cursor-pointer transition-all duration-300 hover:opacity-90"
                        />
                      );
                    })}
                  </svg>

                  {/* Dynamic Center Display */}
                  <div className="pointer-events-none absolute text-center px-1">
                    <span
                      className="text-xl font-black block tracking-tight transition-colors"
                      style={{
                        color: activeItem
                          ? activeItem.color
                          : agency.slices[0].color,
                      }}
                    >
                      {activeItem
                        ? `${activeItem.percent}%`
                        : `${agency.approvedPercent}%`}
                    </span>
                    <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 block truncate max-w-21.25 mx-auto">
                      {activeItem ? activeItem.label : "Approved"}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 block mt-0.5">
                      {activeItem ? activeItem.count : agency.approvedCount}
                    </span>
                  </div>
                </div>

                {/* Legend Details */}
                <div className="flex-1 space-y-2">
                  {agency.slices.map((slice, idx) => {
                    const isHovered =
                      hoveredSlice?.agencyId === agency.id &&
                      hoveredSlice?.idx === idx;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border ${
                          isHovered
                            ? "bg-white dark:bg-slate-700 shadow-xs border-emerald-300 font-bold scale-[1.02]"
                            : "bg-white/60 dark:bg-slate-800/60 border-slate-200/50 dark:border-slate-700/50 hover:bg-white"
                        }`}
                        onMouseEnter={() =>
                          setHoveredSlice({ agencyId: agency.id, idx })
                        }
                        onMouseLeave={() => setHoveredSlice(null)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: slice.color }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-slate-800 dark:text-slate-200 font-semibold truncate text-[11px]">
                              {slice.label}
                            </span>
                            <span className="text-[9.5px] text-slate-500 dark:text-slate-400">
                              {slice.count}
                            </span>
                          </div>
                        </div>
                        <span className="font-extrabold text-slate-900 dark:text-white shrink-0 ml-2 text-xs">
                          {slice.percent}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
