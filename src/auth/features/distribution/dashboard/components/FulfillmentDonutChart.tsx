import { useState } from "react";
import { Card } from "shared/components/panels";

interface SegmentItem {
  label: string;
  percent: string;
  count: string;
  color: string;
  strokeDashoffset: number;
}

export function FulfillmentDonutChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const legendItems: SegmentItem[] = [
    {
      label: "Approved & Dispatched",
      percent: "65%",
      count: "1,89,052 Units",
      color: "#047857",
      strokeDashoffset: 83.5,
    },
    {
      label: "In Transit",
      percent: "20%",
      count: "58,170 Units",
      color: "#10b981",
      strokeDashoffset: 191,
    },
    {
      label: "Pending Dispatch",
      percent: "10%",
      count: "29,085 Units",
      color: "#f59e0b",
      strokeDashoffset: 214.8,
    },
    {
      label: "Other Statuses",
      percent: "5%",
      count: "14,543 Units",
      color: "#0284c7",
      strokeDashoffset: 226.7,
    },
  ];

  const activeSegment = hoveredIdx !== null ? legendItems[hoveredIdx] : null;

  return (
    <Card className="h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <i className="pi pi-chart-pie text-emerald-600 dark:text-emerald-400" />
          Fulfillment Status
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Overall distribution pipeline breakdown
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
        {/* SVG Interactive Donut Chart */}
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
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
                  strokeWidth={isHovered ? "19" : "15"}
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
          <div className="absolute text-center px-2 pointer-events-none transition-all duration-200">
            <span className="text-xl font-extrabold text-gray-900 dark:text-white block tracking-tight">
              {activeSegment ? activeSegment.percent : "85.4%"}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block truncate max-w-[100px]">
              {activeSegment ? activeSegment.label : "Fulfilled"}
            </span>
            {activeSegment && (
              <span className="text-[9.5px] font-semibold text-gray-500 dark:text-gray-400 block mt-0.5">
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
                className={`flex items-center justify-between p-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  isHovered
                    ? "bg-emerald-50 dark:bg-emerald-950/40 font-bold scale-[1.02]"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium truncate">
                    {item.label}
                  </span>
                </div>
                <span className="font-extrabold text-gray-900 dark:text-white shrink-0 ml-2">
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
