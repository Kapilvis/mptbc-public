import { useState } from "react";
import { Card } from "shared/components/panels";
import type { DepotDemandDistributionItem } from "../data/depotDemandDistributionData";
import { BarChart3, Info } from "lucide-react";

interface DepotComparisonChartProps {
  data: DepotDemandDistributionItem[];
  onSelectDepot?: (depot: DepotDemandDistributionItem) => void;
}

export function DepotComparisonChart({
  data,
  onSelectDepot,
}: DepotComparisonChartProps) {
  const [hoveredDepot, setHoveredDepot] =
    useState<DepotDemandDistributionItem | null>(null);

  // Maximum value for scaling bars
  const maxVal = Math.max(...data.map((d) => d.totalDemand), 85000);

  return (
    <Card className="mb-5 border bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-2xs">
      <div className="p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Depot Demand, Allocation & Fulfillment Comparison
              </h3>
              <p className="text-[11.5px] text-slate-500 dark:text-slate-400">
                Visual analysis across all 8 Corporation Depots for Academic
                Session 2026-2027
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 flex-wrap text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-500 inline-block" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Approved Demand
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-purple-500 inline-block" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Work Allocated
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Delivered in Depot
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-teal-500 inline-block" />
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Dispatched to Block
              </span>
            </div>
          </div>
        </div>

        {/* Bar comparison grid */}
        <div className="space-y-3.5">
          {data.map((item) => {
            const approvedWidth = (item.approvedDemand / maxVal) * 100;
            const allocatedWidth = (item.workAllocatedToPrinter / maxVal) * 100;
            const deliveredWidth = (item.deliveryInDepot / maxVal) * 100;
            const dispatchedWidth = (item.dispatchToBlock / maxVal) * 100;

            const isHovered = hoveredDepot?.id === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredDepot(item)}
                onMouseLeave={() => setHoveredDepot(null)}
                onClick={() => onSelectDepot && onSelectDepot(item)}
                className={`p-2.5 rounded-xl transition-all duration-150 cursor-pointer border ${
                  isHovered
                    ? "bg-slate-50 dark:bg-slate-800/60 border-indigo-200 dark:border-indigo-800 shadow-xs"
                    : "border-transparent hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100 min-w-[80px]">
                      {item.depotName}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Group {item.groupCategory}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      (Opening: {item.openingStock.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-600 dark:text-slate-300 font-semibold">
                      Appr: {item.approvedDemand.toLocaleString()}
                    </span>
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">
                      Alloc: {item.workAllocatedToPrinter.toLocaleString()}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Recv: {item.deliveryInDepot.toLocaleString()} (
                      {item.deliveryPercent}%)
                    </span>
                    <span className="text-teal-600 dark:text-teal-400 font-semibold">
                      Disp: {item.dispatchToBlock.toLocaleString()} (
                      {item.dispatchPercent}%)
                    </span>
                  </div>
                </div>

                {/* Bars Stack */}
                <div className="space-y-1 bg-slate-100/60 dark:bg-slate-800/40 p-1.5 rounded-lg">
                  {/* Approved Demand Bar */}
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${approvedWidth}%` }}
                      title={`Approved Demand: ${item.approvedDemand.toLocaleString()}`}
                    />
                  </div>

                  {/* Work Allocated Bar */}
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${allocatedWidth}%` }}
                      title={`Work Allocated: ${item.workAllocatedToPrinter.toLocaleString()}`}
                    />
                  </div>

                  {/* Delivered in Depot Bar */}
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${deliveredWidth}%` }}
                      title={`Delivered in Depot: ${item.deliveryInDepot.toLocaleString()}`}
                    />
                  </div>

                  {/* Dispatched to Block Bar */}
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${dispatchedWidth}%` }}
                      title={`Dispatched to Block: ${item.dispatchToBlock.toLocaleString()}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Formula calculation notice at bottom of chart */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Info size={14} className="text-blue-500" />
            <span>
              <strong>Formula:</strong> Work Allocation to Printer = Approved
              Demand − Opening Stock | Depot Balance = Opening Stock + Delivered
              in Depot − Block Dispatch
            </span>
          </div>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Total 8 Depots
          </span>
        </div>
      </div>
    </Card>
  );
}
