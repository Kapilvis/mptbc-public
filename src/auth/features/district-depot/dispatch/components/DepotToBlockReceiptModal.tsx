import type { DispatchHistoryItem } from "../data";

interface Props {
  item: DispatchHistoryItem;
  onClose: () => void;
}

export function DepotToBlockReceiptModal({ item, onClose }: Props) {
  const handlePrint = () => window.print();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-emerald-600 border-b border-emerald-700">
          <div className="flex items-center gap-2 text-white">
            <i className="pi pi-file-pdf text-lg" />
            <span className="font-bold text-sm">
              Dispatch Challan — Depot → Block
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg font-semibold flex items-center gap-1.5"
            >
              <i className="pi pi-print" /> Print
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full"
            >
              <i className="pi pi-times text-xs" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Organization Header */}
          <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
              Madhya Pradesh Textbook Corporation
            </p>
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white mt-1">
              Book Dispatch Challan
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              प्रेषण चालान — डिपो से विकासखण्ड
            </p>
          </div>

          {/* Route Banner */}
          <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl px-4 py-2.5">
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                From Depot
              </div>
              <div className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                {item.depotName} ({item.depotCode})
              </div>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-emerald-300 dark:border-emerald-700 relative">
              <i className="pi pi-truck text-emerald-500 absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-50 dark:bg-emerald-950/30 px-1" />
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                To Block
              </div>
              <div className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                {item.blockName}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
            {[
              { label: "Challan No", value: item.challanNo },
              { label: "Date", value: item.date },
              { label: "Academic Year", value: item.year },
              { label: "Class Group", value: item.classGroup },
              { label: "Truck / Vehicle No", value: item.truckNo },
              {
                label: "Status",
                value: item.status === 1 ? "✅ Acknowledged" : "⏳ Pending",
              },
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

          {/* Book Dispatch Table */}
          <div>
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
              Dispatch Summary
            </div>
            <table className="w-full text-xs border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-emerald-600 text-white">
                  <th className="px-3 py-2 text-left">Class Group</th>
                  <th className="px-3 py-2 text-right">Total Bundles</th>
                  <th className="px-3 py-2 text-right">Total Books</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-50 dark:bg-gray-800/40">
                  <td className="px-3 py-2 font-semibold text-gray-800 dark:text-gray-200">
                    {item.classGroup}
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-blue-700 dark:text-blue-400">
                    {item.totalBundles.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-emerald-700 dark:text-emerald-400">
                    {item.totalBooks.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signature Section */}
          <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="text-center">
              <div className="border-t border-gray-400 w-32 mb-1" />
              <div className="text-[10px] text-gray-500">Depot Officer</div>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 w-32 mb-1" />
              <div className="text-[10px] text-gray-500">Block (Receiver)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
