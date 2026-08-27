import type { DepotToDepotKpis } from "../data";

interface DepotTransferKpiCardsProps {
  kpis: DepotToDepotKpis;
}

export function DepotTransferKpiCards({ kpis }: DepotTransferKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* KPI 1: Delivered to Depot */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            DELIVERED TO DEPOT
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {kpis.totalDeliveredQty.toLocaleString()} Books
          </div>
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
            <i className="pi pi-check-circle text-emerald-600 dark:text-emerald-400" />
            From Registered Printers Receipts
          </div>
        </div>
        <span className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 flex items-center justify-center font-bold shrink-0">
          <i className="pi pi-truck text-sm" />
        </span>
      </div>

      {/* KPI 2: Dispatched to Blocks */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            DISPATCHED TO BLOCKS
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {kpis.totalDispatchedQty.toLocaleString()} Books
          </div>
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
            <i className="pi pi-send text-blue-600 dark:text-blue-400" />
            Packed & Dispatched to BRC Blocks
          </div>
        </div>
        <span className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 flex items-center justify-center font-bold shrink-0">
          <i className="pi pi-box text-sm" />
        </span>
      </div>

      {/* KPI 3: Consolidated Remaining Stock */}
      <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-amber-950 dark:text-amber-300 uppercase tracking-wider block">
            CONSOLIDATED REMAINING STOCK
          </span>
          <div className="text-2xl font-black text-amber-950 dark:text-amber-200 mt-1">
            {kpis.consolidatedRemainingStock.toLocaleString()} Books
          </div>
          <div className="text-[11px] font-bold text-amber-800 dark:text-amber-400 mt-0.5 flex items-center gap-1">
            <i className="pi pi-database" />
            Delivered (180.5k) - Sent (150k)
          </div>
        </div>
        <span className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center justify-center font-bold shrink-0">
          <i className="pi pi-database text-sm" />
        </span>
      </div>

      {/* KPI 4: Active Transfers & Saved Procurement */}
      <div className="bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-purple-950 dark:text-purple-300 uppercase tracking-wider block">
            ACTIVE TRANSFERS
          </span>
          <div className="text-2xl font-black text-purple-950 dark:text-purple-200 mt-1">
            {kpis.activeTransfersCount} Sanctioned
          </div>
          <div className="text-[11px] font-bold text-purple-800 dark:text-purple-400 mt-0.5 flex items-center gap-1">
            <i className="pi pi-shield" />
            Saved: <strong>{kpis.savedProcurementCost}</strong>
          </div>
        </div>
        <span className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-800 flex items-center justify-center font-bold shrink-0">
          <i className="pi pi-sync text-sm" />
        </span>
      </div>
    </div>
  );
}
