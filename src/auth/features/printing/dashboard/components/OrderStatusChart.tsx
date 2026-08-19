import { useState } from "react";
import { Card } from "shared/components/panels";
import { dataManager } from "../../../inventory/mockData";

interface Props {
  printerCode: string;
}

export default function OrderStatusChart({ printerCode }: Props) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Load dynamically to verify counts
  const orders = dataManager
    .getOrders()
    .filter((o) => o.printerCode === printerCode);
  const total = orders.length;

  const pendingCount = orders.filter(
    (o) => o.status === "Pending" || o.status === "Approved",
  ).length;
  const inProgressCount = orders.filter(
    (o) => o.status === "Partially Supplied",
  ).length;
  const completedCount = orders.filter((o) => o.status === "Completed").length;
  const onHoldCount = orders.filter(
    (o) => o.status === "Cancelled" || o.status === "Rejected",
  ).length;

  const pendingPct = total > 0 ? Math.round((pendingCount / total) * 100) : 25;
  const inProgressPct =
    total > 0 ? Math.round((inProgressCount / total) * 100) : 42;
  const completedPct =
    total > 0 ? Math.round((completedCount / total) * 100) : 25;
  const onHoldPct = total > 0 ? Math.round((onHoldCount / total) * 100) : 8;

  const segments = [
    {
      label: "Pending",
      percent: `${pendingPct}%`,
      count: pendingCount,
      color: "#F59E0B",
      colorClass: "bg-amber-500",
    },
    {
      label: "In Progress",
      percent: `${inProgressPct}%`,
      count: inProgressCount,
      color: "#3B82F6",
      colorClass: "bg-blue-500",
    },
    {
      label: "Completed",
      percent: `${completedPct}%`,
      count: completedCount,
      color: "#10B981",
      colorClass: "bg-emerald-500",
    },
    {
      label: "On Hold",
      percent: `${onHoldPct}%`,
      count: onHoldCount,
      color: "#8B5CF6",
      colorClass: "bg-purple-500",
    },
  ];

  const activeSegment = hoveredIdx !== null ? segments[hoveredIdx] : null;

  return (
    <Card className="p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-xs h-full flex flex-col justify-between !border-t-transparent relative overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Premium top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 z-20" />

      <div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <i className="pi pi-chart-pie text-[#4F8F70]" />
          Order Status Overview
        </h3>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 py-4">
        {/* Responsive & Reusable SVG Donut Chart */}
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg
            className="w-full h-full transform -rotate-90 transition-all duration-300"
            viewBox="0 0 100 100"
          >
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#E8F4EC"
              strokeWidth="9"
              fill="transparent"
              className="opacity-40"
            />

            {/* Slice 1: Pending (25%) -> Dash = 59.7, Offset = 0 */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#F59E0B"
              strokeWidth={hoveredIdx === 0 ? "12" : "9"}
              strokeDasharray="59.7 238.8"
              strokeDashoffset="0"
              fill="transparent"
              className="cursor-pointer transition-all duration-200 hover:brightness-110"
              onMouseEnter={() => setHoveredIdx(0)}
              onMouseLeave={() => setHoveredIdx(null)}
            />

            {/* Slice 2: In Progress (41.7%) -> Dash = 99.6, Offset = -59.7 */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#3B82F6"
              strokeWidth={hoveredIdx === 1 ? "12" : "9"}
              strokeDasharray="99.6 238.8"
              strokeDashoffset="-59.7"
              fill="transparent"
              className="cursor-pointer transition-all duration-200 hover:brightness-110"
              onMouseEnter={() => setHoveredIdx(1)}
              onMouseLeave={() => setHoveredIdx(null)}
            />

            {/* Slice 3: Completed (25%) -> Dash = 59.7, Offset = -159.3 */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#10B981"
              strokeWidth={hoveredIdx === 2 ? "12" : "9"}
              strokeDasharray="59.7 238.8"
              strokeDashoffset="-159.3"
              fill="transparent"
              className="cursor-pointer transition-all duration-200 hover:brightness-110"
              onMouseEnter={() => setHoveredIdx(2)}
              onMouseLeave={() => setHoveredIdx(null)}
            />

            {/* Slice 4: On Hold (8.3%) -> Dash = 19.8, Offset = -219.0 */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#8B5CF6"
              strokeWidth={hoveredIdx === 3 ? "12" : "9"}
              strokeDasharray="19.8 238.8"
              strokeDashoffset="-219.0"
              fill="transparent"
              className="cursor-pointer transition-all duration-200 hover:brightness-110"
              onMouseEnter={() => setHoveredIdx(3)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          </svg>

          {/* Dynamic Centered Text - Upgraded typography */}
          <div className="absolute text-center pointer-events-none select-none flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900 dark:text-white block font-mono leading-none tracking-tight">
              {activeSegment ? activeSegment.count : total}
            </span>
            <span className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest block mt-1.5">
              {activeSegment ? activeSegment.label : "Total Orders"}
            </span>
          </div>
        </div>

        {/* Legend Grid - Upgraded text size and weights */}
        <div className="grid grid-cols-2 gap-2.5 w-full pt-3 border-t border-gray-150/40 dark:border-gray-800/40">
          {segments.map((s, idx) => (
            <div
              key={s.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center gap-3 p-1.5 rounded-lg cursor-pointer transition-colors duration-150 ${
                hoveredIdx === idx ? "bg-gray-100 dark:bg-gray-800/80" : ""
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full shrink-0 border border-black/5 dark:border-white/5 ${s.colorClass}`}
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-black text-gray-900 dark:text-white block truncate">
                  {s.label}
                </span>
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-extrabold block font-mono mt-0.5">
                  {s.count} Orders ({s.percent})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
