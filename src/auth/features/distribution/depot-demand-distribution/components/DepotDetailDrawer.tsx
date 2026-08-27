import type { DepotDemandDistributionItem } from "../data/depotDemandDistributionData";
import { BookOpen, MapPin, Calculator, X } from "lucide-react";

interface DepotDetailDrawerProps {
  depot: DepotDemandDistributionItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DepotDetailDrawer({
  depot,
  isOpen,
  onClose,
}: DepotDetailDrawerProps) {
  if (!isOpen || !depot) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 dark:bg-black/60 transition-opacity backdrop-blur-2xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative h-full w-full max-w-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl overflow-y-auto border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                {depot.depotCode}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200">
                Group {depot.groupCategory}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {depot.depotName} Depot Distribution Details
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-sm mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black">{depot.depotName} Depot</h2>
              <p className="text-blue-200 text-xs mt-0.5">
                {depot.groupDescription}
              </p>
            </div>

            <div className="text-left sm:text-right bg-white/10 p-3 rounded-xl backdrop-blur-xs">
              <span className="text-[11px] text-blue-200 block">
                Current Depot Stock Available
              </span>
              <span className="text-xl font-black text-emerald-300">
                {depot.currentDepotStock.toLocaleString()} Books
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/15 text-xs">
            <div>
              <span className="text-blue-200 text-[11px] block">
                Assigned Printers
              </span>
              <span className="font-semibold">
                {depot.assignedPrinters.join(", ")}
              </span>
            </div>
            <div>
              <span className="text-blue-200 text-[11px] block">
                Districts Covered
              </span>
              <span className="font-semibold">
                {depot.districtCount} Districts
              </span>
            </div>
            <div>
              <span className="text-blue-200 text-[11px] block">
                Blocks Served
              </span>
              <span className="font-semibold">{depot.blockCount} Blocks</span>
            </div>
            <div>
              <span className="text-blue-200 text-[11px] block">
                Delivery / Dispatch Rate
              </span>
              <span className="font-semibold">
                {depot.deliveryPercent}% / {depot.dispatchPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Mathematical Flow Card */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Calculator
              size={16}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Mathematical Stock & Allocation Breakdown
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-center">
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mb-1">
                1. Total Demand
              </span>
              <span className="text-sm font-black text-blue-700 dark:text-blue-400">
                {depot.totalDemand.toLocaleString()}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mb-1">
                2. Approved Demand
              </span>
              <span className="text-sm font-black text-indigo-700 dark:text-indigo-400">
                {depot.approvedDemand.toLocaleString()}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mb-1">
                3. Opening Stock (−)
              </span>
              <span className="text-sm font-black text-amber-700 dark:text-amber-400">
                {depot.openingStock.toLocaleString()}
              </span>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/40 p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 shadow-2xs">
              <span className="text-[10.5px] text-purple-700 dark:text-purple-300 font-bold block mb-1">
                4. Printer Alloc (=)
              </span>
              <span className="text-sm font-black text-purple-800 dark:text-purple-300">
                {depot.workAllocatedToPrinter.toLocaleString()}
              </span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-2xs">
              <span className="text-[10.5px] text-emerald-700 dark:text-emerald-300 font-bold block mb-1">
                5. Delivered Depot
              </span>
              <span className="text-sm font-black text-emerald-800 dark:text-emerald-300">
                {depot.deliveryInDepot.toLocaleString()}
              </span>
            </div>

            <div className="bg-teal-50 dark:bg-teal-950/40 p-2.5 rounded-xl border border-teal-200 dark:border-teal-800 shadow-2xs">
              <span className="text-[10.5px] text-teal-700 dark:text-teal-300 font-bold block mb-1">
                6. Dispatched Block
              </span>
              <span className="text-sm font-black text-teal-800 dark:text-teal-300">
                {depot.dispatchToBlock.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Title-wise Breakdown Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs mb-5">
          <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen
                size={16}
                className="text-indigo-600 dark:text-indigo-400"
              />
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                NCERT Title-Wise Allocation & Delivery Breakdown
              </h4>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {depot.titleDetails.length} Titles
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase text-[10.5px] font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-2.5 text-center">#</th>
                  <th className="p-2.5">Title Name</th>
                  <th className="p-2.5 text-center">Class</th>
                  <th className="p-2.5 text-center">Medium</th>
                  <th className="p-2.5 text-right">Demand</th>
                  <th className="p-2.5 text-right">Approved</th>
                  <th className="p-2.5 text-right">Opening Stock</th>
                  <th className="p-2.5 text-right text-purple-700 dark:text-purple-400">
                    Allocated
                  </th>
                  <th className="p-2.5 text-right text-emerald-700 dark:text-emerald-400">
                    Delivered
                  </th>
                  <th className="p-2.5 text-right text-teal-700 dark:text-teal-400">
                    Dispatched
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {depot.titleDetails.map((t, idx) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="p-2.5 text-center font-medium text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">
                      {t.titleName}
                    </td>
                    <td className="p-2.5 text-center">{t.classNo}</td>
                    <td className="p-2.5 text-center">{t.medium}</td>
                    <td className="p-2.5 text-right font-medium">
                      {t.demandQty.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-bold text-indigo-700 dark:text-indigo-400">
                      {t.approvedDemandQty.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right text-amber-700 dark:text-amber-400">
                      {t.openingStock.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-bold text-purple-700 dark:text-purple-400">
                      {t.workAllocationQty.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-bold text-emerald-700 dark:text-emerald-400">
                      {t.receivedInDepot.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-bold text-teal-700 dark:text-teal-400">
                      {t.dispatchedToBlock.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Block-wise Dispatch Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs">
          <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-teal-600 dark:text-teal-400" />
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Block-Wise Dispatch Progress ({depot.depotName} Jurisdiction)
              </h4>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {depot.blockDetails.length} Sample Blocks
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase text-[10.5px] font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-2.5">Block Name</th>
                  <th className="p-2.5">District</th>
                  <th className="p-2.5 text-right">Requirement</th>
                  <th className="p-2.5 text-right text-teal-700 dark:text-teal-400">
                    Dispatched
                  </th>
                  <th className="p-2.5 text-right text-amber-700 dark:text-amber-400">
                    Pending
                  </th>
                  <th className="p-2.5 text-center">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {depot.blockDetails.map((b) => (
                  <tr
                    key={b.blockCode}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="p-2.5 font-bold text-slate-800 dark:text-slate-200">
                      {b.blockName}
                    </td>
                    <td className="p-2.5 text-slate-600 dark:text-slate-400">
                      {b.district}
                    </td>
                    <td className="p-2.5 text-right font-medium">
                      {b.totalBooksRequirement.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-bold text-teal-700 dark:text-teal-400">
                      {b.dispatchedQty.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-right font-medium text-amber-600 dark:text-amber-400">
                      {b.pendingQty.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full"
                            style={{ width: `${b.completionPercent}%` }}
                          />
                        </div>
                        <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300">
                          {b.completionPercent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
