import { useState } from "react";
import { Card } from "shared/components/panels";

interface SegmentItem {
  label: string;
  percent: string;
  count: string;
  color: string;
  strokeDashoffset: number;
}

export function OrderStatusDonutChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const legendItems: SegmentItem[] = [
    {
      label: "Approved & Delivered",
      percent: "60%",
      count: "2,265 MT Dispatched",
      color: "#10b981",
      strokeDashoffset: 95.5,
    },
    {
      label: "In Transit",
      percent: "20%",
      count: "755 MT Shipped",
      color: "#3b82f6",
      strokeDashoffset: 191,
    },
    {
      label: "Pending Approval",
      percent: "10%",
      count: "377 MT Under Review",
      color: "#f59e0b",
      strokeDashoffset: 214.8,
    },
    {
      label: "Rejected / On Hold",
      percent: "10%",
      count: "377 MT On Hold",
      color: "#f43f5e",
      strokeDashoffset: 238.7,
    },
  ];

  const activeSegment = hoveredIdx !== null ? legendItems[hoveredIdx] : null;

  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <i className="pi pi-chart-pie text-emerald-600 dark:text-emerald-400" />
          Work Order Status Distribution
        </h3>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 py-2">
        {/* SVG Interactive Donut Chart */}
        <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
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
              {activeSegment ? activeSegment.percent : "83.8%"}
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

        {/* Legend Grid */}
        <div className="grid grid-cols-2 gap-2 w-full pt-3 border-t border-gray-100 dark:border-gray-800">
          {legendItems.map((st, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <div
                key={i}
                className={`flex items-center gap-2 text-xs p-1.5 rounded-lg cursor-pointer transition-colors duration-150 ${
                  isHovered ? "bg-gray-100 dark:bg-gray-700/60" : ""
                }`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: st.color }}
                />
                <span className="text-gray-700 dark:text-gray-300 font-semibold truncate text-[11px]">
                  {st.label} ({st.percent})
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
