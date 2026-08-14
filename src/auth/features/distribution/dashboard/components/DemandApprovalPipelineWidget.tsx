import { useState } from "react";
import { Card } from "shared/components/panels";

interface ProgressRowItem {
  id: string;
  name: string;
  approved: string;
  total: string;
  percent: number;
  barColor: string;
  bgColor: string;
  textColor: string;
}

interface PendingSegmentItem {
  label: string;
  percent: string;
  count: string;
  color: string;
  strokeDashoffset: number;
}

export function DemandApprovalPipelineWidget() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredDonutIdx, setHoveredDonutIdx] = useState<number | null>(null);

  const progressItems: ProgressRowItem[] = [
    {
      id: "rsk",
      name: "RSK Agency (Rajya Shiksha Kendra)",
      approved: "1,10,000",
      total: "1,45,000",
      percent: 75,
      barColor: "bg-emerald-600",
      bgColor: "bg-emerald-100/60 dark:bg-emerald-950/40",
      textColor: "text-emerald-700 dark:text-emerald-400",
    },
    {
      id: "cpi",
      name: "CPI Agency (Public Instruction)",
      approved: "22,000",
      total: "45,000",
      percent: 48,
      barColor: "bg-teal-600",
      bgColor: "bg-teal-100/60 dark:bg-teal-950/40",
      textColor: "text-teal-700 dark:text-teal-400",
    },
    {
      id: "total",
      name: "Total Approved Demands",
      approved: "1,32,000",
      total: "1,90,000",
      percent: 69,
      barColor: "bg-gradient-to-r from-emerald-600 to-teal-600",
      bgColor: "bg-emerald-200/50 dark:bg-emerald-900/50",
      textColor: "text-emerald-800 dark:text-emerald-300",
    },
    {
      id: "pending",
      name: "Pending Approval Queue",
      approved: "58,000",
      total: "1,90,000",
      percent: 31,
      barColor: "bg-amber-500",
      bgColor: "bg-amber-100/60 dark:bg-amber-950/40",
      textColor: "text-amber-700 dark:text-amber-400",
    },
  ];

  const donutLegendItems: PendingSegmentItem[] = [
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

  const activeSegment =
    hoveredDonutIdx !== null ? donutLegendItems[hoveredDonutIdx] : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
      {/* Left Card: Demand Approval Pipeline Status Progress Bars */}
      <Card className="lg:col-span-7 flex flex-col justify-between p-4">
        <div>
          {/* Header - Matching Demand vs Supply header size (text-sm font-bold) */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i className="pi pi-check-square text-emerald-600 dark:text-emerald-400 text-base" />
                Demand Approval Status
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Approved & processed agency demand allocation progress
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 shadow-2xs">
              Approved: 1,32,000 / 1,90,000 (69%)
            </span>
          </div>

          {/* Progress Slider Bars */}
          <div className="mt-3 space-y-2">
            {progressItems.map((item) => {
              const isHovered = hoveredId === item.id;
              return (
                <div
                  key={item.id}
                  className={`p-1 rounded-lg border transition-all duration-150 cursor-pointer ${
                    isHovered
                      ? "bg-gray-50/80 border-emerald-300 dark:bg-gray-800/80 dark:border-emerald-700 shadow-2xs"
                      : "border-transparent"
                  }`}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="flex justify-between items-center text-xs mb-1 font-semibold">
                    <span className="text-gray-800 dark:text-gray-200 font-bold flex items-center gap-2 truncate">
                      <span
                        className={`w-2 h-2 rounded-full ${item.barColor} shrink-0`}
                      />
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span
                      className={`font-bold text-xs shrink-0 ml-2 ${item.textColor}`}
                    >
                      {item.approved} / {item.total} Units —{" "}
                      <span className="underline">{item.percent}%</span>
                    </span>
                  </div>

                  {/* Slider Bar Track */}
                  <div
                    className={`h-2.5 w-full ${item.bgColor} rounded-full overflow-hidden p-0.5 relative`}
                  >
                    <div
                      className={`h-full ${item.barColor} rounded-full transition-all duration-500 ease-out shadow-2xs`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Right Card: Current Pending Demands Donut (Fulfillment Donut Interactive Style) */}
      <Card className="lg:col-span-5 flex flex-col justify-between p-4">
        <div>
          {/* Header - Matching Demand vs Supply header size (text-sm font-bold) */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <i className="pi pi-chart-pie text-amber-600 dark:text-amber-400 text-base" />
                Current Pending Demands
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pending approval vs needs review status
              </p>
            </div>
          </div>

          {/* Donut Chart & Legend Container (Fulfillment Donut Interactive Style) */}
          <div className="mt-3 flex items-center justify-between gap-4 py-1">
            {/* SVG Interactive Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg
                className="w-full h-full transform -rotate-90 transition-transform duration-300"
                viewBox="0 0 100 100"
              >
                {donutLegendItems.map((item, idx) => {
                  const isHovered = hoveredDonutIdx === idx;
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
                      onMouseEnter={() => setHoveredDonutIdx(idx)}
                      onMouseLeave={() => setHoveredDonutIdx(null)}
                    />
                  );
                })}
              </svg>

              {/* Dynamic Center Display (Fulfillment Donut Style) */}
              <div className="absolute text-center px-2 pointer-events-none transition-all duration-200">
                <span className="text-xl font-extrabold text-gray-900 dark:text-white block tracking-tight">
                  {activeSegment ? activeSegment.percent : "58,000"}
                </span>
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block truncate max-w-[100px]">
                  {activeSegment ? activeSegment.label : "Pending Qty"}
                </span>
                {activeSegment && (
                  <span className="text-[9.5px] font-semibold text-gray-500 dark:text-gray-400 block mt-0.5">
                    {activeSegment.count}
                  </span>
                )}
              </div>
            </div>

            {/* Right Legend List (Fulfillment Donut Interactive Style) */}
            <div className="flex-1 w-full space-y-2">
              {donutLegendItems.map((item, idx) => {
                const isHovered = hoveredDonutIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs transition-all cursor-pointer border ${
                      isHovered
                        ? "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 font-bold scale-[1.02]"
                        : "bg-gray-50/50 border-gray-100 dark:bg-gray-800/40 dark:border-gray-800 hover:bg-gray-100/60"
                    }`}
                    onMouseEnter={() => setHoveredDonutIdx(idx)}
                    onMouseLeave={() => setHoveredDonutIdx(null)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-gray-800 dark:text-gray-200 font-semibold truncate text-xs">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                          {item.count}
                        </span>
                      </div>
                    </div>
                    <span className="font-extrabold text-gray-900 dark:text-white shrink-0 ml-2 text-xs">
                      {item.percent}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
