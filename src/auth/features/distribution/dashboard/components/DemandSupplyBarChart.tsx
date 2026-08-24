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
    { district: "Agar Malwa", demand: 16100, supply: 5474 }, // 34% (Below Avg / Red)
    { district: "Alirajpur", demand: 13500, supply: 11529 },
    { district: "Anuppur", demand: 17000, supply: 6120 }, // 36% (Below Avg / Red)
    { district: "Betul", demand: 18300, supply: 15628 },
    { district: "Bhind", demand: 11300, supply: 3616 }, // 32% (Below Avg / Red)
    { district: "Bhopal", demand: 19700, supply: 17730 },
    { district: "Chhindwara", demand: 15400, supply: 5698 }, // 37% (Below Avg / Red)
    { district: "Dewas", demand: 15300, supply: 13464 },
    { district: "Dhar", demand: 17900, supply: 15931 },
    { district: "Gwalior", demand: 18800, supply: 16544 },
    { district: "Indore", demand: 20200, supply: 18584 },
    { district: "Jabalpur", demand: 19200, supply: 17280 },
    { district: "Katni", demand: 14000, supply: 5040 }, // 36% (Below Avg / Red)
    { district: "Khandwa", demand: 15800, supply: 13904 },
    { district: "Khargone", demand: 16400, supply: 14432 },
    { district: "Morena", demand: 11000, supply: 3850 }, // 35% (Below Avg / Red)
    { district: "Panna", demand: 11400, supply: 4104 }, // 36% (Below Avg / Red)
    { district: "Ratlam", demand: 15900, supply: 12752 },
    { district: "Rewa", demand: 17300, supply: 15224 },
    { district: "Sagar", demand: 17900, supply: 15752 },
    { district: "Satna", demand: 16700, supply: 14696 },
    { district: "Sehore", demand: 18200, supply: 16835 },
    { district: "Ujjain", demand: 17600, supply: 15664 },
    { district: "Vidisha", demand: 15100, supply: 13288 },
  ];

  const maxValue = 25000;
  const startX = 52;
  const groupWidth = 44;
  const svgWidth = Math.max(750, startX + data.length * groupWidth + 30);

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
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" />
            <span className="text-rose-700 dark:text-rose-400 font-bold">
              Delay (&lt;40%)
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
            <span
              className={
                activeDistrict.supply / activeDistrict.demand < 0.45
                  ? "text-rose-400 font-bold"
                  : "text-amber-400 font-semibold"
              }
            >
              Supply: {activeDistrict.supply.toLocaleString()}
            </span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded ${
                activeDistrict.supply / activeDistrict.demand < 0.45
                  ? "bg-rose-900/80 text-rose-200"
                  : "bg-gray-800 dark:bg-gray-700 text-gray-300"
              }`}
            >
              {Math.round(
                (activeDistrict.supply / activeDistrict.demand) * 100,
              )}
              %
            </span>
          </div>
        </div>
      )}

      {/* SVG Slim Dual-Grouped Bar Chart Container with Horizontal Scroll */}
      <div className="w-full flex-1 min-h-[250px] pt-4 pb-2 overflow-x-auto">
        <svg
          className="h-full min-w-full overflow-visible"
          style={{ width: `${svgWidth}px` }}
          viewBox={`0 0 ${svgWidth} 230`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Slim Demand Gradient */}
            <linearGradient id="slimDemandGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Slim Supply Gradient (Normal) */}
            <linearGradient id="slimSupplyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Slim Supply Gradient (Critical Deficit - Red Tint) */}
            <linearGradient
              id="slimCriticalSupplyGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
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
            const y = 155 - (val / maxValue) * 135;
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
            const demandHeight = (item.demand / maxValue) * 135;
            const demandY = 155 - demandHeight;

            const supplyHeight = (item.supply / maxValue) * 135;
            const supplyY = 155 - supplyHeight;

            const isCritical = item.supply / item.demand < 0.45;
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
                  height="135"
                  rx="6"
                  fill={
                    isHovered
                      ? isCritical
                        ? "rgba(244, 63, 94, 0.08)"
                        : "rgba(16, 185, 129, 0.06)"
                      : "transparent"
                  }
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

                {/* Slim Supply Bar (Red if Critical, Orange otherwise) */}
                <rect
                  x={groupX + slimWidth + 3}
                  y={supplyY}
                  width={slimWidth}
                  height={supplyHeight}
                  rx="6"
                  fill={
                    isCritical
                      ? "url(#slimCriticalSupplyGradient)"
                      : "url(#slimSupplyGradient)"
                  }
                  className="transition-all duration-200 ease-out origin-bottom transform group-hover/group:scale-y-105"
                />

                {/* X Axis Label - Slanted Alignment Without Truncation Dots */}
                <text
                  x={groupX + slimWidth}
                  y="172"
                  transform={`rotate(-40, ${groupX + slimWidth}, 172)`}
                  textAnchor="end"
                  fontSize="9.5"
                  fill={
                    isHovered ? "#047857" : isCritical ? "#be123c" : "#4b5563"
                  }
                  className="font-bold dark:fill-gray-300 transition-colors duration-150"
                >
                  {item.district}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}
