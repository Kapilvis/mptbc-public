import { useState } from "react";
import { Card } from "shared/components/panels";

interface DistrictChartData {
  district: string;
  demand: number;
  supply: number;
}

export function DemandSupplyBarChart() {
  const [activeDistrict, setActiveDistrict] =
    useState<DistrictChartData | null>(null);

  const data: DistrictChartData[] = [
    { district: "Agar Malwa", demand: 19800, supply: 15840 },
    { district: "Alirajpur", demand: 16500, supply: 14091 },
    { district: "Anuppur", demand: 20800, supply: 17097 },
    { district: "Betul", demand: 22500, supply: 19215 },
    { district: "Bhind", demand: 13800, supply: 12861 },
    { district: "Bhopal", demand: 24200, supply: 21780 },
    { district: "Chhindwara", demand: 18900, supply: 16632 },
    { district: "Dewas", demand: 18700, supply: 16456 },
    { district: "Dhar", demand: 21900, supply: 19491 },
    { district: "Gwalior", demand: 23100, supply: 20328 },
    { district: "Indore", demand: 24800, supply: 22816 },
    { district: "Jabalpur", demand: 23500, supply: 21150 },
    { district: "Katni", demand: 17200, supply: 15136 },
    { district: "Khandwa", demand: 19400, supply: 17072 },
    { district: "Khargone", demand: 20100, supply: 17688 },
    { district: "Morena", demand: 13500, supply: 11259 },
    { district: "Panna", demand: 14000, supply: 11228 },
    { district: "Ratlam", demand: 19500, supply: 15639 },
    { district: "Rewa", demand: 21200, supply: 18656 },
    { district: "Sagar", demand: 22000, supply: 19360 },
    { district: "Satna", demand: 20500, supply: 18040 },
    { district: "Sehore", demand: 22350, supply: 20673 },
    { district: "Ujjain", demand: 21600, supply: 19224 },
    { district: "Vidisha", demand: 18300, supply: 16104 },
  ];

  const maxValue = 25000;
  const startX = 52;
  const groupWidth = 44;
  const svgWidth = Math.max(650, startX + data.length * groupWidth + 20);

  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden relative group">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i className="pi pi-chart-bar text-emerald-600 dark:text-emerald-400" />
            Demand vs Supply
          </h3>
          <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {data.length} Districts
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
            <span className="text-gray-700 dark:text-gray-300">Net Demand</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
            <span className="text-gray-700 dark:text-gray-300">
              Dispatched Supply
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Floating Tooltip */}
      {activeDistrict && (
        <div className="absolute top-14 right-6 z-20 bg-gray-900/95 text-white dark:bg-gray-800 text-xs py-2 px-3.5 rounded-xl shadow-xl border border-gray-700 backdrop-blur-xs animate-in fade-in zoom-in-95 duration-150 flex items-center gap-4">
          <span className="font-bold text-white tracking-wide">
            {activeDistrict.district}
          </span>
          <div className="flex items-center gap-2 border-l border-gray-700 pl-3">
            <span className="text-emerald-400 font-semibold">
              Demand: {activeDistrict.demand.toLocaleString()}
            </span>
            <span className="text-amber-400 font-semibold">
              Supply: {activeDistrict.supply.toLocaleString()}
            </span>
            <span className="text-gray-300 font-bold bg-gray-800 dark:bg-gray-700 px-1.5 py-0.5 rounded">
              {Math.round(
                (activeDistrict.supply / activeDistrict.demand) * 100,
              )}
              %
            </span>
          </div>
        </div>
      )}

      {/* SVG Slim Dual-Grouped Bar Chart Container with Horizontal Scroll */}
      <div className="w-full flex-1 min-h-[220px] pt-4 pb-2 overflow-x-auto">
        <svg
          className="h-full min-w-full overflow-visible"
          style={{ width: `${svgWidth}px` }}
          viewBox={`0 0 ${svgWidth} 200`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Slim Demand Gradient */}
            <linearGradient id="slimDemandGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Slim Supply Gradient */}
            <linearGradient id="slimSupplyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Hover Glow Filter */}
            <filter id="barGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#10b981"
                floodOpacity="0.3"
              />
            </filter>
          </defs>

          {/* Y Axis Grid lines */}
          {[0, 5000, 10000, 15000, 20000, 25000].map((val, idx) => {
            const y = 160 - (val / maxValue) * 140;
            return (
              <g key={idx}>
                <line
                  x1="45"
                  y1={y}
                  x2={svgWidth - 15}
                  y2={y}
                  stroke="#f3f4f6"
                  strokeDasharray="3 3"
                  className="dark:stroke-gray-800/80"
                />
                <text
                  x="40"
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#9ca3af"
                  className="font-medium"
                >
                  {val.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* District Groups with Slim Dual Bars */}
          {data.map((item, idx) => {
            const groupX = startX + idx * groupWidth;

            const slimWidth = 13;
            const demandHeight = (item.demand / maxValue) * 140;
            const demandY = 160 - demandHeight;

            const supplyHeight = (item.supply / maxValue) * 140;
            const supplyY = 160 - supplyHeight;

            const isHovered = activeDistrict?.district === item.district;

            return (
              <g
                key={idx}
                className="cursor-pointer group/group"
                onMouseEnter={() => setActiveDistrict(item)}
                onMouseLeave={() => setActiveDistrict(null)}
              >
                {/* Subtle Pillar Track */}
                <rect
                  x={groupX - 2}
                  y="20"
                  width={slimWidth * 2 + 8}
                  height="140"
                  rx="6"
                  fill={isHovered ? "rgba(16, 185, 129, 0.06)" : "transparent"}
                  className="transition-colors duration-200"
                />

                {/* Slim Demand Bar */}
                <rect
                  x={groupX}
                  y={demandY}
                  width={slimWidth}
                  height={demandHeight}
                  rx="6"
                  fill="url(#slimDemandGradient)"
                  className="transition-all duration-200 ease-out origin-bottom transform group-hover/group:scale-y-105"
                  filter={isHovered ? "url(#barGlow)" : undefined}
                />

                {/* Slim Supply Bar */}
                <rect
                  x={groupX + slimWidth + 3}
                  y={supplyY}
                  width={slimWidth}
                  height={supplyHeight}
                  rx="6"
                  fill="url(#slimSupplyGradient)"
                  className="transition-all duration-200 ease-out origin-bottom transform group-hover/group:scale-y-105"
                />

                {/* X Axis Label */}
                <text
                  x={groupX + slimWidth + 1.5}
                  y="180"
                  textAnchor="middle"
                  fontSize="8.5"
                  fill={isHovered ? "#047857" : "#6b7280"}
                  className="font-bold dark:fill-gray-300 transition-colors duration-150"
                >
                  {item.district.length > 7
                    ? item.district.substring(0, 6) + "…"
                    : item.district}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}
