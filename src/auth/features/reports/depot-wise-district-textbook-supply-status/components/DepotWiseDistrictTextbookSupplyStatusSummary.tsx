import { useMemo } from "react";
import { depotWiseDistrictTextbookSupplyStatusData } from "../data/depotWiseDistrictTextbookSupplyStatusData";

interface SummaryCard {
  label: string;
  value: string | number;
  icon: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export default function DepotWiseDistrictTextbookSupplyStatusSummary() {
  const stats = useMemo(() => {
    const dataRows = depotWiseDistrictTextbookSupplyStatusData.filter(
      (r) =>
        r.districtName !== "Depots Total" &&
        r.depotName !== "All Depots" &&
        r.depotName !== "Previous Day Supply" &&
        r.depotName !== "Today Difference",
    );
    const uniqueDepots = new Set(dataRows.map((r) => r.depotName));
    const uniqueDistricts = new Set(dataRows.map((r) => r.districtName));
    const grandTotal = depotWiseDistrictTextbookSupplyStatusData.find(
      (r) => r.depotName === "All Depots",
    );
    return {
      totalDepots: uniqueDepots.size,
      totalDistricts: uniqueDistricts.size,
      totalDemand: grandTotal ? Number(grandTotal.totalDemand) : 0,
      totalSupplyPct: grandTotal ? Number(grandTotal.totalSupplyPercent) : 0,
    };
  }, []);

  const cards: SummaryCard[] = [
    {
      label: "Total Depots",
      value: stats.totalDepots,
      icon: "pi pi-building",
      colorClass: "text-indigo-700",
      bgClass: "bg-indigo-50",
      borderClass: "border-indigo-100",
    },
    {
      label: "Total Districts",
      value: stats.totalDistricts,
      icon: "pi pi-map",
      colorClass: "text-sky-700",
      bgClass: "bg-sky-50",
      borderClass: "border-sky-100",
    },
    {
      label: "Total Demand",
      value: stats.totalDemand.toLocaleString("en-IN"),
      icon: "pi pi-book",
      colorClass: "text-amber-700",
      bgClass: "bg-amber-50",
      borderClass: "border-amber-100",
    },
    {
      label: "Total Supply %",
      value: `${stats.totalSupplyPct.toFixed(2)}%`,
      icon: "pi pi-check-circle",
      colorClass: "text-emerald-700",
      bgClass: "bg-emerald-50",
      borderClass: "border-emerald-100",
    },
  ];

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`flex items-center gap-3 rounded-xl border p-4 shadow-sm transition-transform hover:-translate-y-0.5 ${card.bgClass} ${card.borderClass}`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-white shadow-sm ${card.borderClass}`}
          >
            <i className={`${card.icon} ${card.colorClass} text-base`} />
          </div>
          <div className="min-w-0">
            <p className="mb-0.5 text-xs font-medium leading-tight text-gray-500">
              {card.label}
            </p>
            <p className={`text-lg font-bold leading-tight ${card.colorClass}`}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
