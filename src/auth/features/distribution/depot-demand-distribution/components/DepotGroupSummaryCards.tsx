import { Card } from "shared/components/panels";
import { GROUP_SUMMARIES } from "../data/depotDemandDistributionData";
import type { DepotGroupSummary } from "../data/depotDemandDistributionData";
import { MapPin, CheckCircle } from "lucide-react";

interface DepotGroupSummaryCardsProps {
  selectedGroup: string;
  onSelectGroup: (group: string) => void;
}

export function DepotGroupSummaryCards({
  selectedGroup,
  onSelectGroup,
}: DepotGroupSummaryCardsProps) {
  const getThemeClasses = (category: string) => {
    switch (category) {
      case "A":
        return {
          border: "hover:border-emerald-500/80",
          selected:
            "ring-2 ring-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500",
          tag: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
          badge: "bg-emerald-500 text-white",
          barColor: "bg-emerald-500",
          iconColor: "text-emerald-600 dark:text-emerald-400",
        };
      case "B":
        return {
          border: "hover:border-blue-500/80",
          selected:
            "ring-2 ring-blue-500 bg-blue-50/40 dark:bg-blue-950/20 border-blue-500",
          tag: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
          badge: "bg-blue-500 text-white",
          barColor: "bg-blue-500",
          iconColor: "text-blue-600 dark:text-blue-400",
        };
      case "C":
        return {
          border: "hover:border-indigo-500/80",
          selected:
            "ring-2 ring-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-500",
          tag: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
          badge: "bg-indigo-500 text-white",
          barColor: "bg-indigo-500",
          iconColor: "text-indigo-600 dark:text-indigo-400",
        };
      case "D":
      default:
        return {
          border: "hover:border-amber-500/80",
          selected:
            "ring-2 ring-amber-500 bg-amber-50/40 dark:bg-amber-950/20 border-amber-500",
          tag: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
          badge: "bg-amber-500 text-white",
          barColor: "bg-amber-500",
          iconColor: "text-amber-600 dark:text-amber-400",
        };
    }
  };

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2.5">
        {selectedGroup !== "All" && (
          <button
            onClick={() => onSelectGroup("All")}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Show All Depots
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {GROUP_SUMMARIES.map((group: DepotGroupSummary) => {
          const theme = getThemeClasses(group.groupCategory);
          const isSelected = selectedGroup === group.groupCategory;

          return (
            <div
              key={group.groupCategory}
              onClick={() =>
                onSelectGroup(isSelected ? "All" : group.groupCategory)
              }
              className="cursor-pointer"
            >
              <Card
                className={`transition-all duration-200 border bg-white dark:bg-slate-900 ${
                  isSelected
                    ? theme.selected
                    : `border-slate-200/90 dark:border-slate-800 ${theme.border}`
                } shadow-2xs hover:shadow-sm`}
              >
                <div className="p-3.5">
                  {/* Header with Group tag and Depots */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-md ${theme.tag}`}
                      >
                        Group {group.groupCategory}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {group.groupTitle}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle size={13} /> Selected
                      </span>
                    )}
                  </div>

                  {/* Depots Included List */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    <MapPin size={13} className={theme.iconColor} />
                    {group.depots.map((d, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 mb-2.5">
                    <div>
                      <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block">
                        Approved Demand
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {group.approvedDemand.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block">
                        Work Allocation
                      </span>
                      <span className="font-bold text-purple-700 dark:text-purple-400">
                        {group.workAllocation.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block">
                        Depot Received
                      </span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {group.deliveryInDepot.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block">
                        Block Dispatched
                      </span>
                      <span className="font-bold text-teal-700 dark:text-teal-400">
                        {group.dispatchToBlock.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar (Depot Delivery Progress) */}
                  <div>
                    <div className="flex justify-between text-[10.5px] text-slate-500 dark:text-slate-400 mb-1">
                      <span>Depot Delivery Fulfillment</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {group.deliveryPercent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${theme.barColor}`}
                        style={{ width: `${group.deliveryPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
