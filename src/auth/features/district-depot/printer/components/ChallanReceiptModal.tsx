import type { PrinterChallanItem } from "../data";

interface Props {
  challan: PrinterChallanItem;
  onClose: () => void;
}

export function ChallanReceiptModal({ challan, onClose }: Props) {
  const handlePrint = () => window.print();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-blue-600">
          <div className="flex items-center gap-2 text-white">
            <i className="pi pi-file-pdf text-lg" />
            <span className="font-bold text-sm">
              Challan Receipt — Printer → Depot
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
            >
              <i className="pi pi-print" /> Print
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <i className="pi pi-times text-xs" />
            </button>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 print:p-0 space-y-4">
          {/* Organization Header */}
          <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-3">
            <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Madhya Pradesh Textbook Corporation
            </div>
            <div className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">
              Book Receipt Challan
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              प्राप्ति रसीद — मुद्रक से डिपो
            </div>
          </div>

          {/* Two-column details */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
            {[
              { label: "Challan No", value: challan.challanNo },
              { label: "Receipt Date", value: challan.receiptDate },
              { label: "Depot", value: challan.depotCode },
              { label: "Challan Date", value: challan.challanDate },
              { label: "Printer Name", value: challan.printerName },
              { label: "Vehicle No", value: challan.vehicleNo },
              { label: "Driver Name", value: challan.driverName },
              { label: "Driver Mobile", value: challan.driverMobile },
              { label: "Warehouse", value: challan.warehouse },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-2">
                <span className="font-semibold text-gray-500 dark:text-gray-400 w-28 shrink-0">
                  {label}:
                </span>
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Book Details Table */}
          <div>
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Book / Title Details
            </div>
            <table className="w-full text-xs border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-3 py-2 text-left">Title</th>
                  <th className="px-3 py-2 text-right">Dispatched Qty</th>
                  <th className="px-3 py-2 text-right">Received Qty</th>
                  <th className="px-3 py-2 text-right">Shortage</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-50 dark:bg-gray-800/40">
                  <td className="px-3 py-2 font-semibold text-gray-800 dark:text-gray-200">
                    {challan.title}
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-blue-700 dark:text-blue-400">
                    {challan.dispatchedQty.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-emerald-700 dark:text-emerald-400">
                    {challan.receivedQty.toLocaleString()}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-bold ${challan.shortage > 0 ? "text-rose-700 dark:text-rose-400" : "text-gray-400"}`}
                  >
                    {challan.shortage > 0
                      ? challan.shortage.toLocaleString()
                      : "—"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Status & Signature */}
          <div className="flex items-end justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="text-xs">
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                Status:{" "}
              </span>
              <span
                className={`font-bold ${challan.shortage > 0 ? "text-rose-600" : "text-emerald-600"}`}
              >
                {challan.status}
              </span>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 w-40 mb-1" />
              <div className="text-[10px] text-gray-500 dark:text-gray-400">
                Depot Officer Signature
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
