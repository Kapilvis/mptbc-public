import { useState } from "react";
import { Button } from "shared/components/buttons";
import { Modal } from "shared/components/popups";
import { formatDate } from "shared/utils/dateUtils";
import type { OpeningStockItem } from "../data";

interface ApproveStockModalProps {
  item: OpeningStockItem | null;
  onHide: () => void;
  onConfirmApprove: (stockId: string, remarks?: string) => void;
}

export function ApproveStockModal({
  item,
  onHide,
  onConfirmApprove,
}: ApproveStockModalProps) {
  const [remarks, setRemarks] = useState(
    "Verified & locked as official Opening Stock for FY 2027-2028",
  );

  if (!item) return null;

  const isApproved = item.status === "HO_APPROVED";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmApprove(item.id, remarks);
  };

  return (
    <Modal
      visible={Boolean(item)}
      onHide={onHide}
      header={
        isApproved
          ? `Opening Stock Audit Record: ${item.depotName}`
          : `Approve Carried-Over Opening Stock: ${item.depotName}`
      }
      size="medium"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-1">
        {/* Header Summary */}
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <span className="font-extrabold text-emerald-950 dark:text-emerald-200 block text-sm">
              {item.depotName} ({item.division} Division)
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Bay Location: {item.warehouseBay}
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-black uppercase border ${
              isApproved
                ? "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/60 dark:text-emerald-200"
                : "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/60 dark:text-amber-200"
            }`}
          >
            {isApproved ? "HO APPROVED & CONSOLIDATED" : "PENDING HO APPROVAL"}
          </span>
        </div>

        {/* Inventory Audit Formula Breakdown Table */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-white dark:bg-slate-900 space-y-3">
          <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Consolidated Carry-Forward Stock Calculation
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-extrabold block uppercase">
                1. PRINTER RECEIPTS
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white mt-0.5 block">
                +{item.totalDeliveredQty.toLocaleString()}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-extrabold block uppercase">
                2. BLOCK DISPATCHES
              </span>
              <span className="text-sm font-black text-rose-700 dark:text-rose-400 mt-0.5 block">
                -{item.totalDispatchedQty.toLocaleString()}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-500 font-extrabold block uppercase">
                3. NET INTER-DEPOT
              </span>
              <span
                className={`text-sm font-black mt-0.5 block ${
                  item.netInterDepotQty > 0
                    ? "text-emerald-700 dark:text-emerald-400"
                    : item.netInterDepotQty < 0
                      ? "text-rose-700 dark:text-rose-400"
                      : "text-slate-600"
                }`}
              >
                {item.netInterDepotQty > 0
                  ? `+${item.netInterDepotQty.toLocaleString()}`
                  : item.netInterDepotQty.toLocaleString()}
              </span>
            </div>

            <div className="p-2.5 bg-emerald-100/70 dark:bg-emerald-950/60 rounded-xl border border-emerald-300 dark:border-emerald-800">
              <span className="text-[10px] text-emerald-900 dark:text-emerald-300 font-extrabold block uppercase">
                = OPENING STOCK
              </span>
              <span className="text-base font-black text-emerald-800 dark:text-emerald-300 mt-0.5 block">
                {item.calculatedOpeningStockQty.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Approval Remarks Input */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            HO Approval Remarks / Verification Notes
          </label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            disabled={isApproved}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 disabled:opacity-75"
          />
        </div>

        {isApproved && item.approvedBy && (
          <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            Approved by <strong>{item.approvedBy}</strong> on{" "}
            <strong>{formatDate(item.approvedDate)}</strong>
          </div>
        )}

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button
            label="Close"
            variant="outlined"
            onClick={onHide}
            type="button"
          />
          {!isApproved && (
            <Button
              label="Approve & Lock Opening Stock"
              icon="pi pi-check-circle"
              variant="primary"
              type="submit"
            />
          )}
        </div>
      </form>
    </Modal>
  );
}
