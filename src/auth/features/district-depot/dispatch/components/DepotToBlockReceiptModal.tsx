import { Modal } from "shared/components/popups";
import type { DispatchHistoryItem } from "../data";

interface Props {
  item: DispatchHistoryItem;
  onClose: () => void;
}

interface ReceiptBookRow {
  sNo: number;
  title: string;
  bundle: number;
  dispatch: number;
  received: number;
  short: number;
  damaged: number;
}

export function DepotToBlockReceiptModal({ item, onClose }: Props) {
  const handlePrint = () => window.print();

  // Generate sample multi-title book details matching totalBundles and totalBooks
  const bookDetails: ReceiptBookRow[] = [
    {
      sNo: 1,
      title:
        "2026-27 हेतु एफएलएन अभ्यास पुस्तिका (तीन चरणों में) (कक्षा 1 से 4)-अभ्यास पुस्तिका गणित व पर्यावरण अध्ययन (तृतीय चरण)(कक्षा 3) (FLN)",
      bundle: Math.round(item.totalBundles * 0.25) || 14,
      dispatch: Math.round(item.totalBooks * 0.25) || 1474,
      received:
        item.status === 1 ? Math.round(item.totalBooks * 0.25) || 1474 : 0,
      short: 0,
      damaged: 0,
    },
    {
      sNo: 2,
      title:
        "2026-27 हेतु एटग्रेड अभ्यास पुस्तिका (कक्षा 5 से 8)-एटग्रेड अभ्यास पुस्तिका कक्षा 7 (विज्ञान) (एटग्रेड)",
      bundle: Math.round(item.totalBundles * 0.35) || 15,
      dispatch: Math.round(item.totalBooks * 0.35) || 2100,
      received:
        item.status === 1 ? Math.round(item.totalBooks * 0.35) || 2100 : 0,
      short: 0,
      damaged: 0,
    },
    {
      sNo: 3,
      title:
        "2026-27 हेतु एटग्रेड अभ्यास पुस्तिका (कक्षा 5 से 8)-एटग्रेड अभ्यास पुस्तिका कक्षा 8 (अंग्रेजी) (एटग्रेड)",
      bundle: Math.round(item.totalBundles * 0.4) || 12,
      dispatch:
        item.totalBooks -
          (Math.round(item.totalBooks * 0.25) +
            Math.round(item.totalBooks * 0.35)) || 2218,
      received:
        item.status === 1
          ? item.totalBooks -
              (Math.round(item.totalBooks * 0.25) +
                Math.round(item.totalBooks * 0.35)) || 2218
          : 0,
      short: 0,
      damaged: 0,
    },
    {
      sNo: 4,
      title: "भाषा भारती - कक्षा 6 (हिंदी माध्यम)",
      bundle: 14,
      dispatch: 1405,
      received: item.status === 1 ? 1405 : 0,
      short: 0,
      damaged: 0,
    },
    {
      sNo: 5,
      title: "गणित प्रकाश - कक्षा 7",
      bundle: 14,
      dispatch: 1195,
      received: item.status === 1 ? 1195 : 0,
      short: 0,
      damaged: 0,
    },
  ];

  const totalBundle = bookDetails.reduce((s, r) => s + r.bundle, 0);
  const totalDispatch = bookDetails.reduce((s, r) => s + r.dispatch, 0);
  const totalReceived = bookDetails.reduce((s, r) => s + r.received, 0);
  const totalShort = bookDetails.reduce((s, r) => s + r.short, 0);
  const totalDamaged = bookDetails.reduce((s, r) => s + r.damaged, 0);

  return (
    <Modal
      visible={true}
      onHide={onClose}
      header="TBC to Block Challan Received Receipt"
      size="large"
    >
      <div className="p-4 print:p-0 space-y-5 text-xs text-slate-800 dark:text-slate-200">
        {/* Header Action Button */}
        <div className="flex justify-end print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <i className="pi pi-print" /> Save as PDF / Print
          </button>
        </div>

        {/* Official Header */}
        <div className="text-center border-b border-slate-200 dark:border-slate-700 pb-3">
          <h1 className="text-base font-black uppercase text-slate-900 dark:text-white tracking-wide">
            TEXT BOOK CORPORATION BOOK DISTRIBUTION CHALLAN
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Government of Madhya Pradesh
          </p>
        </div>

        {/* Key Metadata Fields Grid */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-6 text-[11px]">
          <div>
            <span className="font-semibold text-slate-500 block">
              Academic Year:
            </span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              {item.year}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">Block:</span>
            <span className="font-extrabold text-slate-900 dark:text-white">
              {item.blockName}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">
              Challan No:
            </span>
            <span className="font-mono font-extrabold text-amber-700 dark:text-amber-400">
              {item.challanNo}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-500 block">
              Class Group:
            </span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">
              {item.classGroup}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-500 block">
              Challan Date:
            </span>
            <span className="font-semibold">{item.date}</span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-500 block">
              Depot Name:
            </span>
            <span className="font-bold">
              {item.depotName} ({item.depotCode})
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-500 block">
              Received Date:
            </span>
            <span className="font-semibold">
              {item.status === 1 ? item.date : "Pending"}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-500 block">
              Receiving Office:
            </span>
            <span className="font-bold">
              BRC, {item.blockName.toUpperCase()}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-500 block">
              Total Bundle:
            </span>
            <span className="font-black text-blue-700 dark:text-blue-400">
              {totalBundle.toLocaleString()}
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="font-semibold text-slate-500 block">
              Total Received:
            </span>
            <span className="font-black text-emerald-700 dark:text-emerald-400">
              {totalReceived.toLocaleString()} Books
            </span>
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 col-span-2">
            <span className="font-semibold text-slate-500 block">
              Truck / Vehicle No:
            </span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
              {item.truckNo}
            </span>
          </div>
        </div>

        {/* Challan Books Details Table Section */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-2.5 text-white flex items-center gap-2">
            <i className="pi pi-book text-sm" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider">
              Challan Books Details (Multiple Textbook Line Items)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5 text-center w-12 border-r border-slate-200 dark:border-slate-700">
                    S.No
                  </th>
                  <th className="p-2.5 border-r border-slate-200 dark:border-slate-700 min-w-[280px]">
                    Title (Book Name)
                  </th>
                  <th className="p-2.5 text-center w-20 border-r border-slate-200 dark:border-slate-700">
                    Bundle
                  </th>
                  <th className="p-2.5 text-center w-24 border-r border-slate-200 dark:border-slate-700">
                    Dispatch
                  </th>
                  <th className="p-2.5 text-center w-24 border-r border-slate-200 dark:border-slate-700">
                    Received
                  </th>
                  <th className="p-2.5 text-center w-20 border-r border-slate-200 dark:border-slate-700">
                    Short
                  </th>
                  <th className="p-2.5 text-center w-20">Damaged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookDetails.map((row) => (
                  <tr
                    key={row.sNo}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-2.5 text-center font-medium text-slate-500 border-r border-slate-100 dark:border-slate-800">
                      {row.sNo}
                    </td>
                    <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200 leading-snug border-r border-slate-100 dark:border-slate-800">
                      {row.title}
                    </td>
                    <td className="p-2.5 text-center font-bold text-blue-700 dark:text-blue-400 border-r border-slate-100 dark:border-slate-800">
                      {row.bundle.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center font-bold text-slate-800 dark:text-slate-200 border-r border-slate-100 dark:border-slate-800">
                      {row.dispatch.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center font-extrabold text-emerald-700 dark:text-emerald-400 border-r border-slate-100 dark:border-slate-800">
                      {row.received.toLocaleString()}
                    </td>
                    <td className="p-2.5 text-center font-bold text-slate-400 border-r border-slate-100 dark:border-slate-800">
                      {row.short}
                    </td>
                    <td className="p-2.5 text-center font-bold text-slate-400">
                      {row.damaged}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white border-t-2 border-slate-200 dark:border-slate-700">
                  <td
                    colSpan={2}
                    className="p-2.5 text-right uppercase text-[10px] tracking-wider border-r border-slate-200 dark:border-slate-700"
                  >
                    Total:
                  </td>
                  <td className="p-2.5 text-center text-blue-700 dark:text-blue-400 border-r border-slate-200 dark:border-slate-700">
                    {totalBundle.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-center border-r border-slate-200 dark:border-slate-700">
                    {totalDispatch.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-center text-emerald-700 dark:text-emerald-400 border-r border-slate-200 dark:border-slate-700">
                    {totalReceived.toLocaleString()}
                  </td>
                  <td className="p-2.5 text-center border-r border-slate-200 dark:border-slate-700">
                    {totalShort}
                  </td>
                  <td className="p-2.5 text-center">{totalDamaged}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Signature Section */}
        <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="text-center">
            <div className="border-t border-slate-400 w-36 mb-1" />
            <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
              Depot Officer Signature
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-400 w-36 mb-1" />
            <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
              Block (Receiver) Signature
            </div>
          </div>
        </div>

        {/* Footer Note & Actions */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 italic">
            Note: This is an official system generated textbook distribution
            challan document.
          </p>
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg font-bold flex items-center gap-1.5 transition-colors"
            >
              <i className="pi pi-file-pdf" /> Save as PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs rounded-lg font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
