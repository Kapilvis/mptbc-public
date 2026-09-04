import { useState } from "react";
import { Modal } from "shared/components/popups";
import type { PrinterChallanItem } from "../data";

interface Props {
  challan: PrinterChallanItem;
  onClose: () => void;
  onConfirm: (updatedData: {
    shortage: number;
    damagedQty: number;
    remark?: string;
  }) => void;
}

const damageReasons = [
  "Transit / Water Damage",
  "Printing / Ink Smudge",
  "Binding / Stitching Defect",
  "Missing / Torn Pages",
  "Cover Printing Defect",
  "Other Inspection Issue",
];

export function UpdateShortageDamageModal({
  challan,
  onClose,
  onConfirm,
}: Props) {
  const [shortage, setShortage] = useState<number>(challan.shortage || 0);
  const [damagedQty, setDamagedQty] = useState<number>(challan.damagedQty || 0);
  const [reason, setReason] = useState<string>(damageReasons[0]);
  const [remark, setRemark] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      shortage,
      damagedQty,
      remark: `${reason}${remark ? ` - ${remark}` : ""}`,
    });
  };

  return (
    <Modal
      visible={true}
      onHide={onClose}
      header="Update Short Supply & Damage Report"
      size="medium"
    >
      {/* Modal Body */}
      <form onSubmit={handleSubmit} className="p-2 space-y-4">
        {/* Item Info Summary */}
        <div className="bg-amber-50 dark:bg-amber-950/20 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/40 text-xs space-y-1.5">
          <div className="flex justify-between items-center font-bold">
            <span className="text-amber-800 dark:text-amber-300 font-mono text-sm">
              {challan.challanNo}
            </span>
            <span className="text-amber-700 dark:text-amber-400">
              {challan.printerName}
            </span>
          </div>
          <div className="text-gray-700 dark:text-gray-300 font-semibold">
            Title: {challan.title}
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-400 text-[11px] pt-1 border-t border-amber-200/60 dark:border-amber-800/40">
            <span>
              Dispatched:{" "}
              <strong className="text-blue-700 dark:text-blue-400">
                {challan.dispatchedQty.toLocaleString()}
              </strong>
            </span>
            <span>
              Received:{" "}
              <strong className="text-emerald-700 dark:text-emerald-400">
                {challan.receivedQty.toLocaleString()}
              </strong>
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Short Supply Quantity
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={shortage === 0 ? "" : shortage}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setShortage(val === "" ? 0 : Number(val));
              }}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Damaged Books Quantity
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={damagedQty === 0 ? "" : damagedQty}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setDamagedQty(val === "" ? 0 : Number(val));
              }}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          <div className="col-span-2">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Damage / Defect Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              {damageReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Inspection Remarks
            </label>
            <textarea
              rows={2}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter details about short supply or damage..."
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
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
            className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <i className="pi pi-save" /> Save Inspection Report
          </button>
        </div>
      </form>
    </Modal>
  );
}
