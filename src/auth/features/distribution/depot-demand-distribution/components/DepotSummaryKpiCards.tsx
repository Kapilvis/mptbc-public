import { Card } from "shared/components/panels";
import {
  BookOpen,
  CheckCircle2,
  Package,
  Printer,
  Truck,
  Send,
} from "lucide-react";

interface DepotSummaryKpiCardsProps {
  totals: {
    totalDemand: number;
    approvedDemand: number;
    openingStock: number;
    actualDemandForWorkAllocation: number;
    workAllocatedToPrinter: number;
    deliveryInDepot: number;
    dispatchToBlock: number;
    currentDepotStock: number;
    deliveryPercent: number;
    dispatchPercent: number;
  };
}

export function DepotSummaryKpiCards({ totals }: DepotSummaryKpiCardsProps) {
  const cards = [
    {
      title: "Total Demand",
      value: totals.totalDemand.toLocaleString(),
      icon: BookOpen,
      topBorder: "bg-blue-500",
      iconBg:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50",
    },
    {
      title: "Approved Demand",
      value: totals.approvedDemand.toLocaleString(),
      icon: CheckCircle2,
      topBorder: "bg-indigo-500",
      iconBg:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50",
    },
    {
      title: "Opening Stock",
      value: totals.openingStock.toLocaleString(),
      icon: Package,
      topBorder: "bg-amber-500",
      iconBg:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50",
    },
    {
      title: "Printer Work Allocation",
      value: totals.workAllocatedToPrinter.toLocaleString(),
      icon: Printer,
      topBorder: "bg-purple-500",
      iconBg:
        "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50",
    },
    {
      title: "Delivered in Depot",
      value: totals.deliveryInDepot.toLocaleString(),
      icon: Truck,
      topBorder: "bg-emerald-500",
      iconBg:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50",
    },
    {
      title: "Dispatched to Block",
      value: totals.dispatchToBlock.toLocaleString(),
      icon: Send,
      topBorder: "bg-teal-500",
      iconBg:
        "bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400 border border-teal-100 dark:border-teal-900/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 mb-5">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <Card
            key={idx}
            className="relative overflow-hidden border bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:shadow-md transition-all duration-200 border-t-transparent!"
          >
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${card.topBorder}`}
            />
            <div className="p-3.5">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}
                >
                  <IconComponent size={20} />
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block truncate">
                  {card.title}
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {card.value}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
