import React, { useState } from "react";
import { ZONE_PROGRESS_DATA } from "../data/adminDashboardData";

interface TooltipState {
  zone: string;
  metric: string;
  value: number;
  color: string;
  x: number;
  y: number;
}

export const AdminAnalyticsGrid: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grouped" | "fulfillment" | "table">(
    "fulfillment",
  );
  const [hoveredTooltip, setHoveredTooltip] = useState<TooltipState | null>(
    null,
  );

  const maxY = 70000;
  const yTicks = [70000, 60000, 50000, 40000, 30000, 20000, 10000, 0];

  const getProgressStyles = (pct: number) => {
    if (pct < 40) {
      return {
        barBg: "bg-rose-500",
        text: "text-rose-600 dark:text-rose-400",
        badge:
          "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300",
      };
    }
    if (pct < 70) {
      return {
        barBg: "bg-amber-500",
        text: "text-amber-600 dark:text-amber-400",
        badge:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
      };
    }
    return {
      barBg: "bg-emerald-600",
      text: "text-emerald-700 dark:text-emerald-400",
      badge:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
    };
  };

  return (
    <div className="mb-6">
      {/* 1. Statewide Regional Performance Container */}
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div>
          {/* Top Header & View Toggle Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                  <i className="pi pi-chart-bar" aria-hidden="true" />
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Depot Wise : Demand vs Printing vs Supply Progress
                </h3>
              </div>
            </div>

            {/* View Mode Toggle Switcher & Legend */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setViewMode("fulfillment")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                    viewMode === "fulfillment"
                      ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                  }`}
                >
                  Fulfillment %
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grouped")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                    viewMode === "grouped"
                      ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                  }`}
                >
                  Grouped Columns
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                    viewMode === "table"
                      ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                  }`}
                >
                  Table View
                </button>
              </div>

              {/* Legend */}
              <div className="hidden sm:flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-emerald-600" />
                  Net Demand
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" />
                  Printed
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm bg-blue-600" />
                  Dispatched
                </span>
              </div>
            </div>
          </div>

          {/* Mode 1: Vertical Grouped Column Bar Chart (Gemini Image 3 Style) */}
          {viewMode === "grouped" && (
            <div className="relative pt-2 pb-2">
              {/* Floating Interactive Tooltip */}
              {hoveredTooltip && (
                <div
                  className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xl dark:bg-slate-800"
                  style={{
                    left: `${hoveredTooltip.x}%`,
                    top: `${hoveredTooltip.y}%`,
                  }}
                >
                  <div className="text-[10px] text-slate-300 uppercase tracking-wider">
                    {hoveredTooltip.zone}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: hoveredTooltip.color }}
                    />
                    <span>{hoveredTooltip.metric}:</span>
                    <span className="font-extrabold">
                      {hoveredTooltip.value.toLocaleString()} Quantity
                    </span>
                  </div>
                  <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full border-4 border-transparent border-t-slate-900 dark:border-t-slate-800" />
                </div>
              )}

              {/* Main Chart Container with Fixed Y-Axis Label Width */}
              <div className="flex items-end gap-3 pt-2">
                {/* Y-Axis Column (Fixed Label Alignment) */}
                <div className="flex h-64 flex-col justify-between text-right text-[11px] font-bold text-slate-400 dark:text-slate-500 pr-2 shrink-0 border-r border-slate-200 dark:border-slate-700">
                  {yTicks.map((val) => (
                    <span key={val} className="leading-none">
                      {val.toLocaleString()}
                    </span>
                  ))}
                </div>

                {/* Vertical Bar Canvas Area */}
                <div className="relative flex h-64 flex-1 items-end justify-around border-b border-slate-200 dark:border-slate-700 pb-0">
                  {/* Grid Lines */}
                  {yTicks.slice(0, -1).map((val) => {
                    const topPct = ((maxY - val) / maxY) * 100;
                    return (
                      <div
                        key={val}
                        className="absolute left-0 w-full border-t border-slate-100 dark:border-slate-800/80 pointer-events-none"
                        style={{ top: `${topPct}%` }}
                      />
                    );
                  })}

                  {/* Zone Column Groups */}
                  {ZONE_PROGRESS_DATA.map((z, zoneIdx) => {
                    const demandHeight = (z.netDemand / maxY) * 100;
                    const printedHeight = (z.printed / maxY) * 100;
                    const dispatchedHeight = (z.dispatched / maxY) * 100;

                    const totalZones = ZONE_PROGRESS_DATA.length;
                    const groupX = 14 + ((zoneIdx + 0.5) / totalZones) * 80;

                    return (
                      <div
                        key={z.zone}
                        className="relative flex h-full items-end justify-center gap-1.5 sm:gap-2 px-1 group/zone"
                      >
                        {/* 1. Demand Vertical Bar */}
                        <div
                          onMouseEnter={() =>
                            setHoveredTooltip({
                              zone: z.zone,
                              metric: "Net Demand",
                              value: z.netDemand,
                              color: "#059669",
                              x: groupX - 2,
                              y: 85 - demandHeight * 0.75,
                            })
                          }
                          onMouseLeave={() => setHoveredTooltip(null)}
                          className="w-4 sm:w-5 md:w-6 rounded-t-md bg-emerald-600 transition-all duration-300 hover:brightness-110 hover:shadow-md cursor-pointer"
                          style={{ height: `${demandHeight}%` }}
                        />

                        {/* 2. Printed Vertical Bar */}
                        <div
                          onMouseEnter={() =>
                            setHoveredTooltip({
                              zone: z.zone,
                              metric: "Printed Output",
                              value: z.printed,
                              color: "#f59e0b",
                              x: groupX,
                              y: 85 - printedHeight * 0.75,
                            })
                          }
                          onMouseLeave={() => setHoveredTooltip(null)}
                          className="w-4 sm:w-5 md:w-6 rounded-t-md bg-amber-500 transition-all duration-300 hover:brightness-110 hover:shadow-md cursor-pointer"
                          style={{ height: `${printedHeight}%` }}
                        />

                        {/* 3. Dispatched Vertical Bar */}
                        <div
                          onMouseEnter={() =>
                            setHoveredTooltip({
                              zone: z.zone,
                              metric: "Dispatched Output",
                              value: z.dispatched,
                              color: "#2563eb",
                              x: groupX + 2,
                              y: 85 - dispatchedHeight * 0.75,
                            })
                          }
                          onMouseLeave={() => setHoveredTooltip(null)}
                          className="w-4 sm:w-5 md:w-6 rounded-t-md bg-blue-600 transition-all duration-300 hover:brightness-110 hover:shadow-md cursor-pointer"
                          style={{ height: `${dispatchedHeight}%` }}
                        />

                        {/* X-Axis Zone Labels */}
                        <div className="absolute -bottom-6 text-center text-[11px] font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {z.zone}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Fulfillment Percentage Progress Bars */}
          {viewMode === "fulfillment" && (
            <div className="space-y-3 pt-2">
              {ZONE_PROGRESS_DATA.map((zone) => {
                const pct = Math.round(
                  (zone.dispatched / zone.netDemand) * 100,
                );
                const remaining = zone.netDemand - zone.dispatched;
                const style = getProgressStyles(pct);

                return (
                  <div
                    key={zone.zone}
                    className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/30"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      <span>{zone.zone} Depot Supply Progress</span>
                      <span className={style.text}>{pct}% Dispatched</span>
                    </div>
                    <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${style.barBg}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      <span>
                        Total Demand: {zone.netDemand.toLocaleString()}
                      </span>
                      <span>
                        Remaining Balance: {remaining.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Mode 3: Tabular Summary View */}
          {viewMode === "table" && (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800">
                    <th className="py-2.5 px-3">Zone</th>
                    <th className="py-2.5 px-3 text-right">Net Demand</th>
                    <th className="py-2.5 px-3 text-right">Printed</th>
                    <th className="py-2.5 px-3 text-right">Dispatched</th>
                    <th className="py-2.5 px-3 text-right">Fulfillment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ZONE_PROGRESS_DATA.map((z) => {
                    const pct = Math.round((z.dispatched / z.netDemand) * 100);
                    const style = getProgressStyles(pct);
                    return (
                      <tr
                        key={z.zone}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                      >
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {z.zone}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-emerald-700">
                          {z.netDemand.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-amber-600">
                          {z.printed.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-blue-600">
                          {z.dispatched.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={`inline-flex rounded-md px-2 py-0.5 text-[10.5px] font-bold ${style.badge}`}
                          >
                            {pct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsGrid;
