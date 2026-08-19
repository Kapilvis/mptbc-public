import { useState } from "react";
import { Card } from "shared/components/panels";

interface SegmentItem {
  label: string;
  percent: number;
  offset: number;
  count: string;
  color: string;
}

export function FulfillmentDonutChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const radius = 70;
  const circumference = 2 * Math.PI * radius; // 439.82

  const legendItems: SegmentItem[] = [
    {
      label: "Approved & Dispatched",
      percent: 65,
      offset: 0,
      count: "1,89,052 Units",
      color: "#059669", // Emerald
    },
    {
      label: "In Transit",
      percent: 20,
      offset: 65,
      count: "58,170 Units",
      color: "#10b981", // Light Green
    },
    {
      label: "Pending Dispatch",
      percent: 10,
      offset: 85,
      count: "29,085 Units",
      color: "#f59e0b", // Amber
    },
    {
      label: "Other Statuses",
      percent: 5,
      offset: 95,
      count: "14,543 Units",
      color: "#0284c7", // Sky Blue
    },
  ];

  const activeSegment = hoveredIdx !== null ? legendItems[hoveredIdx] : null;

  return (
    <Card className="h-full flex flex-col justify-between p-4">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <i className="pi pi-chart-pie text-emerald-600 dark:text-emerald-400 text-base" />
          Overall Textbook Supply
        </h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
          Consolidated breakdown of demand approval and dispatch progress
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2 my-auto">
        {/* SVG Interactive Donut Chart (100% Full Circle) */}
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full -rotate-90 transform transition-all duration-300"
          >
            {legendItems.map((item, idx) => {
              const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((item.offset / 100) * circumference);
              const isHovered = hoveredIdx === idx;

              return (
                <circle
                  key={idx}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? 22 : 18}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="cursor-pointer transition-all duration-300 hover:opacity-95"
                />
              );
            })}
          </svg>

          {/* Dynamic Center Display */}
          <div className="pointer-events-none absolute text-center px-2">
            <span
              className="text-2xl font-black block tracking-tight transition-colors"
              style={{
                color: activeSegment ? activeSegment.color : "#059669",
              }}
            >
              {activeSegment ? `${activeSegment.percent}%` : "85.4%"}
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block truncate max-w-[100px] mx-auto">
              {activeSegment ? activeSegment.label : "Fulfilled"}
            </span>
            {activeSegment && (
              <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 block mt-0.5">
                {activeSegment.count}
              </span>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-2">
          {legendItems.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border ${
                  isHovered
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 font-bold scale-[1.02] shadow-2xs"
                    : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/60"
                }`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-slate-800 dark:text-slate-200 font-semibold truncate text-xs">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {item.count}
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white shrink-0 ml-2 text-xs">
                  {item.percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
