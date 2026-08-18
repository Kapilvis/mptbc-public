import type { TenderRecord } from "../data";
import { FileText, Calendar, Truck, X, Building } from "lucide-react";

interface TenderDetailDrawerProps {
  visible: boolean;
  tender: TenderRecord | null;
  onClose: () => void;
  onEdit?: (tender: TenderRecord) => void;
}

export default function TenderDetailDrawer({
  visible,
  tender,
  onClose,
  onEdit,
}: TenderDetailDrawerProps) {
  if (!visible || !tender) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
                <FileText size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    {tender.tenderRefNo}
                  </h3>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      tender.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : tender.status === "Draft"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {tender.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate max-w-md mt-0.5">
                  {tender.title}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* General Contract Overview Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Financial Year
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {tender.financialYear}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Covered Districts
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {
                    Array.from(
                      new Set(tender.allocations.map((a) => a.district)),
                    ).length
                  }{" "}
                  Districts
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  NIT Date
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Calendar size={14} className="text-slate-400" />
                  <span>{tender.nitDate}</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Contract Validity
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <Calendar size={14} className="text-emerald-500" />
                  <span>Till {tender.validTill}</span>
                </div>
              </div>
            </div>

            {/* Remarks / Scope */}
            {tender.remarks && (
              <div className="p-3.5 bg-emerald-50/40 border border-emerald-100 rounded-xl text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-emerald-800 block mb-0.5">
                  Tender Scope & Special Conditions:
                </span>
                {tender.remarks}
              </div>
            )}

            {/* District & Transporters Allocation Ledger */}
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-blue-600" />
                  <h4 className="font-bold text-slate-800 text-xs">
                    Allocated Districts & Transporter Rate Contracts (
                    {tender.allocations.length})
                  </h4>
                </div>
              </div>

              <div className="space-y-3">
                {tender.allocations.map((alloc, idx) => (
                  <div
                    key={alloc.id || idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-blue-200 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-800 text-xs">
                          {alloc.district}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            alloc.contractRole === "Primary"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {alloc.contractRole}
                        </span>
                      </div>
                      {alloc.emdAmount && (
                        <span className="text-[10px] text-slate-400 font-semibold">
                          EMD: ₹{alloc.emdAmount.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-3 pl-7">
                      <Building size={14} className="text-slate-400" />
                      <span>{alloc.transporterName}</span>
                      {alloc.agreementRef && (
                        <span className="text-[10px] text-slate-400 ml-auto">
                          Ref: {alloc.agreementRef}
                        </span>
                      )}
                    </div>

                    {/* Rate Slabs Card */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">
                          Cat 1 (&lt; 4.5 MT)
                        </span>
                        <span className="text-xs font-black text-slate-800 mt-0.5 block">
                          ₹{alloc.rates.cat1}{" "}
                          <span className="text-[9px] font-normal text-slate-400">
                            /Metric Ton
                          </span>
                        </span>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">
                          Cat 2 (4.5–9 MT)
                        </span>
                        <span className="text-xs font-black text-slate-800 mt-0.5 block">
                          ₹{alloc.rates.cat2}{" "}
                          <span className="text-[9px] font-normal text-slate-400">
                            /Metric Ton
                          </span>
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">
                          Cat 3 (&ge; 9 MT)
                        </span>
                        <span className="text-xs font-black text-slate-800 mt-0.5 block">
                          ₹{alloc.rates.cat3}{" "}
                          <span className="text-[9px] font-normal text-slate-400">
                            /Metric Ton
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
            >
              Close Drawer
            </button>
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(tender);
                }}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 shadow-sm transition cursor-pointer"
              >
                Edit Tender Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
