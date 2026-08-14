import { useState } from "react";
import { Card } from "shared/components/panels";

interface PendingSegmentItem {
  label: string;
  percent: string;
  count: string;
  color: string;
  strokeDashoffset: number;
}

export function PendingDemandDonutChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const legendItems: PendingSegmentItem[] = [
    {
      label: "Pending Approval",
      percent: "80%",
      count: "58,000 Units",
      color: "#f59e0b",
      strokeDashoffset: 47.7,
    },
    {
      label: "Rejected / Review",
      percent: "20%",
      count: "14,000 Units",
      color: "#ef4444",
      strokeDashoffset: 238.7,
    },
  ];

  const activeSegment = hoveredIdx !== null ? legendItems[hoveredIdx] : null;

  return (
    <Card className="h-full flex flex-col justify-between p-3.5">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
          <i className="pi pi-chart-pie text-amber-600 dark:text-amber-400" />
          Pending Demands Status
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          Agency demand approval breakdown
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1">
        {/* SVG Interactive Donut Chart */}
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg
            className="w-full h-full transform -rotate-90 transition-transform duration-300"
            viewBox="0 0 100 100"
          >
            {legendItems.map((item, idx) => {
              const isHovered = hoveredIdx === idx;
              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r="38"
                  stroke={item.color}
                  strokeWidth={isHovered ? "18" : "14"}
                  strokeDasharray="238.7"
                  strokeDashoffset={item.strokeDashoffset}
                  fill="transparent"
                  className="cursor-pointer transition-all duration-300 hover:brightness-115 opacity-90 hover:opacity-100"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>

          {/* Dynamic Center Display */}
          <div className="absolute text-center px-1 pointer-events-none transition-all duration-200">
            <span className="text-lg font-extrabold text-gray-900 dark:text-white block tracking-tight leading-none">
              {activeSegment ? activeSegment.percent : "58,000"}
            </span>
            <span className="text-[9.5px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block truncate max-w-[90px] mt-0.5">
              {activeSegment ? activeSegment.label : "Pending Qty"}
            </span>
            {activeSegment && (
              <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 block mt-0.5">
                {activeSegment.count}
              </span>
            )}
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 w-full space-y-1.5">
          {legendItems.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  isHovered
                    ? "bg-amber-50 dark:bg-amber-950/40 font-bold scale-[1.02]"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium truncate text-[11px]">
                    {item.label}
                  </span>
                </div>
                <span className="font-extrabold text-gray-900 dark:text-white shrink-0 ml-1 text-xs">
                  {item.percent}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
