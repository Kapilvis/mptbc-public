import { useState } from "react";
import { Card } from "shared/components/panels";
import { getPaymentOverviewData } from "../printerDashboard.mock";

export default function PaymentOverview({
  printerCode,
}: {
  printerCode: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const data = getPaymentOverviewData(printerCode);

  const activeSegment = hoveredIdx !== null ? data.breakdown[hoveredIdx] : null;

  return (
    <Card className="p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-xs h-full flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <i className="pi pi-wallet text-[#4F8F70]" />
          Payment Overview
        </h3>
        <p className="text-xs text-gray-550 dark:text-gray-400 mt-0.5">
          Billing settlement breakdown of textbook orders
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 py-4">
        {/* SVG Interactive Donut Chart */}
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

            {/* Slice 1: Paid (63%) -> Dash = 150.4, Offset = 0 */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#10B981"
              strokeWidth={hoveredIdx === 0 ? "13" : "9"}
              strokeDasharray="150.4 238.8"
              strokeDashoffset="0"
              fill="transparent"
              className="cursor-pointer transition-all duration-200 hover:brightness-110"
              onMouseEnter={() => setHoveredIdx(0)}
              onMouseLeave={() => setHoveredIdx(null)}
            />

            {/* Slice 2: Pending (22%) -> Dash = 52.5, Offset = -150.4 */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#F59E0B"
              strokeWidth={hoveredIdx === 1 ? "13" : "9"}
              strokeDasharray="52.5 238.8"
              strokeDashoffset="-150.4"
              fill="transparent"
              className="cursor-pointer transition-all duration-200 hover:brightness-110"
              onMouseEnter={() => setHoveredIdx(1)}
              onMouseLeave={() => setHoveredIdx(null)}
            />

            {/* Slice 3: Under Processing (15%) -> Dash = 35.8, Offset = -202.9 */}
            <circle
              cx="50"
              cy="50"
              r="38"
              stroke="#8B5CF6"
              strokeWidth={hoveredIdx === 2 ? "13" : "9"}
              strokeDasharray="35.8 238.8"
              strokeDashoffset="-202.9"
              fill="transparent"
              className="cursor-pointer transition-all duration-200 hover:brightness-110"
              onMouseEnter={() => setHoveredIdx(2)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          </svg>

          {/* Dynamic Centered Text */}
          <div className="absolute text-center pointer-events-none select-none">
            <span className="text-xl font-black text-gray-800 dark:text-white block font-mono">
              {activeSegment
                ? `₹${activeSegment.value.toFixed(2)} L`
                : `₹${data.totalValue.toFixed(2)} L`}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {activeSegment ? activeSegment.label : "Total Value"}
            </span>
          </div>
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-1 gap-2 w-full pt-3 border-t border-gray-150/40 dark:border-gray-800/40">
          {data.breakdown.map((s, idx) => (
            <div
              key={s.label}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors duration-150 ${
                hoveredIdx === idx ? "bg-gray-100 dark:bg-gray-800/80" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    s.label === "Paid"
                      ? "bg-emerald-500"
                      : s.label === "Pending"
                        ? "bg-amber-500"
                        : "bg-purple-500"
                  }`}
                />
                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">
                  {s.label}
                </span>
              </div>
              <span className="text-[11px] text-gray-800 dark:text-white font-mono font-bold">
                ₹{s.value.toFixed(2)} L ({s.percent})
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
