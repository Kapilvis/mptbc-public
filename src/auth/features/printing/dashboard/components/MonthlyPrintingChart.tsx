import { Card } from "shared/components/panels";
import { getMonthlyPrintingPerformance } from "../printerDashboard.mock";

export default function MonthlyPrintingChart({
  printerCode,
}: {
  printerCode: string;
}) {
  const data = getMonthlyPrintingPerformance(printerCode);
  const maxVal = 200; // Max ceiling representing 200K books
  const svgHeight = 165;
  const svgWidth = 460;
  const chartHeight = 130;
  const chartWidth = 410;
  const paddingLeft = 40;
  const paddingTop = 15;

  return (
    <Card className="p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-xs h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <i className="pi pi-chart-bar text-[#4F8F70]" />
            Monthly Printing Performance
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Quantity trends of books ordered, printed, and supplied (in
            Thousands)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-gray-550 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#5FAF7A] inline-block" />
            Ordered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#3B82F6] inline-block" />
            Printed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#8B5CF6] inline-block" />
            Supplied
          </span>
        </div>
      </div>

      <div className="w-full">
        {/* Responsive & Reusable SVG Column Chart */}
        <svg
          className="w-full h-auto max-h-[180px]"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          {/* Horizontal Gridlines & Axis labels */}
          {[0, 50, 100, 150, 200].map((val) => {
            const y = chartHeight - (val / maxVal) * chartHeight + paddingTop;
            return (
              <g key={val} className="opacity-45">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={paddingLeft + chartWidth}
                  y2={y}
                  stroke="#E8F4EC"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="fill-gray-400 dark:fill-gray-500 text-[10px] font-bold font-mono"
                >
                  {val}K
                </text>
              </g>
            );
          })}

          {/* Bar Groups */}
          {data.map((item, idx) => {
            const groupWidth = chartWidth / data.length;
            const groupCenter = paddingLeft + idx * groupWidth + groupWidth / 2;

            // Group configuration details
            const barWidth = 9;
            const barSpacing = 2.5;

            const orderedH = (item.ordered / maxVal) * chartHeight;
            const printedH = (item.printed / maxVal) * chartHeight;
            const suppliedH = (item.supplied / maxVal) * chartHeight;

            const baseLineY = chartHeight + paddingTop;

            return (
              <g key={item.month}>
                {/* Bar 1: Ordered */}
                <rect
                  x={groupCenter - barWidth * 1.5 - barSpacing}
                  y={baseLineY - orderedH}
                  width={barWidth}
                  height={orderedH}
                  fill="#5FAF7A"
                  rx="1.5"
                  className="transition-all duration-300 hover:brightness-105"
                />
                {/* Bar 2: Printed */}
                <rect
                  x={groupCenter - barWidth / 2}
                  y={baseLineY - printedH}
                  width={barWidth}
                  height={printedH}
                  fill="#3B82F6"
                  rx="1.5"
                  className="transition-all duration-300 hover:brightness-105"
                />
                {/* Bar 3: Supplied */}
                <rect
                  x={groupCenter + barWidth / 2 + barSpacing}
                  y={baseLineY - suppliedH}
                  width={barWidth}
                  height={suppliedH}
                  fill="#8B5CF6"
                  rx="1.5"
                  className="transition-all duration-300 hover:brightness-105"
                />
                {/* Month labels */}
                <text
                  x={groupCenter}
                  y={baseLineY + 16}
                  textAnchor="middle"
                  className="fill-gray-600 dark:fill-gray-300 text-[11px] font-bold"
                >
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}
