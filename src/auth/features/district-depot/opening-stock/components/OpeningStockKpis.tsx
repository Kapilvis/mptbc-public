import type { OpeningStockKpis as OpeningStockKpisType } from "../data";

interface OpeningStockKpisProps {
  kpis: OpeningStockKpisType;
}

export function OpeningStockKpis({ kpis }: OpeningStockKpisProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      {/* KPI 1: Total Carried Over Opening Stock */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            CARRIED OVER OPENING STOCK
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {kpis.totalCarriedOverStock.toLocaleString()} Books
          </div>
          <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
            <i className="pi pi-check-circle" />
            Carried Forward to FY 2027-2028
          </div>
        </div>
        <span className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800 flex items-center justify-center font-bold shrink-0">
          <i className="pi pi-box text-sm" />
        </span>
      </div>

      {/* KPI 2: Depots Approval Status */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between">
        <div>
          <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            DEPOT APPROVAL STATUS
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {kpis.approvedDepotsCount} Approved / {kpis.pendingApprovalCount}{" "}
            Pending
          </div>
          <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-0.5 flex items-center gap-1">
            <i className="pi pi-clock" />
            Pending HO Verification
          </div>
        </div>
        <span className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 flex items-center justify-center font-bold shrink-0">
          <i className="pi pi-verified text-sm" />
        </span>
      </div>
    </div>
  );
}
