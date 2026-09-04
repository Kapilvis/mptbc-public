import { useState } from "react";
import { Modal } from "shared/components/popups";
import type { PrinterChallanItem } from "../data";

interface Props {
  challan: PrinterChallanItem;
  onClose: () => void;
  onConfirm: (updatedData: {
    receivedQty: number;
    shortage: number;
    receiptDate: string;
    remark?: string;
  }) => void;
}

export function ReceiveChallanModal({ challan, onClose, onConfirm }: Props) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const [receivedQty, setReceivedQty] = useState<number>(challan.dispatchedQty);
  const [receiptDate, setReceiptDate] = useState<string>(today);
  const [remark, setRemark] = useState<string>("");

  const shortage = Math.max(0, challan.dispatchedQty - (receivedQty || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      receivedQty: receivedQty || 0,
      shortage,
      receiptDate,
      remark,
    });
  };

  return (
    <Modal
      visible={true}
      onHide={onClose}
      header="Receive Challan at Depot"
      size="medium"
    >
      {/* Modal Body */}
      <form onSubmit={handleSubmit} className="p-2 space-y-4">
        {/* Challan Summary Card */}
        <div className="bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 text-xs space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono text-sm">
              {challan.challanNo}
            </span>
            <span className="text-gray-500 font-semibold">
              {challan.challanDate}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">
                Printer
              </span>
              <span className="font-semibold">{challan.printerName}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">
                Vehicle No
              </span>
              <span className="font-mono font-semibold">
                {challan.vehicleNo}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">
                Title
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {challan.title}
              </span>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Dispatched Qty
            </label>
            <input
              type="text"
              readOnly
              value={challan.dispatchedQty.toLocaleString()}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-gray-800 font-bold text-blue-600 dark:text-blue-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Receipt Date *
            </label>
            <input
              type="text"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Received Qty *
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={receivedQty === 0 ? "" : receivedQty}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setReceivedQty(val === "" ? 0 : Number(val));
              }}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 font-bold text-emerald-700 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Shortage (auto)
            </label>
            <input
              type="text"
              readOnly
              value={shortage.toLocaleString()}
              className={`w-full px-3 py-2 border rounded-lg font-bold cursor-not-allowed ${
                shortage > 0
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 border-gray-200"
              }`}
            />
          </div>

          <div className="col-span-2">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Remarks (Optional)
            </label>
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="e.g. Received & unloaded at depot"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <i className="pi pi-check" /> Confirm & Receive
          </button>
        </div>
      </form>
    </Modal>
  );
}
