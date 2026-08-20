import { useMemo } from "react";
import { Modal } from "shared/components/popups";
import { dataManager } from "../../../inventory/mockData";
import type { PrinterOrder } from "../../../inventory/types";

interface PaperIssueViewDetailsModalProps {
  visible: boolean;
  onHide: () => void;
  order: PrinterOrder | null;
}

export default function PaperIssueViewDetailsModal({
  visible,
  onHide,
  order,
}: PaperIssueViewDetailsModalProps) {
  if (!order) return null;

  const totalRequired = order.approvedQty;
  const totalIssued = order.suppliedQty;
  const remaining = order.pendingQty;
  const progressPercent = Math.min(
    100,
    totalRequired > 0 ? Math.round((totalIssued / totalRequired) * 100) : 0,
  );

  const gsmBreakdown = useMemo(() => {
    const groups: Record<
      string,
      {
        gsm: number;
        paperType: string;
        approvedQty: number;
        suppliedQty: number;
        pendingQty: number;
      }
    > = {};

    const allOrders = dataManager.getOrders();
    const activeOrders = allOrders.filter(
      (o) => o.printerCode === order.printerCode,
    );

    activeOrders.forEach((o) => {
      const key = `${o.gsm}_${o.paperType}`;
      if (!groups[key]) {
        groups[key] = {
          gsm: o.gsm,
          paperType: o.paperType,
          approvedQty: 0,
          suppliedQty: 0,
          pendingQty: 0,
        };
      }
      groups[key].approvedQty += o.approvedQty;
      groups[key].suppliedQty += o.suppliedQty;
      groups[key].pendingQty += o.pendingQty;
    });

    return Object.values(groups);
  }, [order.printerCode]);

  return (
    <Modal
      visible={visible}
      onHide={onHide}
      header={`Work Order Details & Paper Issue History — ${order.orderNo}`}
      size="medium"
    >
      <div className="space-y-6 text-slate-800 dark:text-slate-200">
        {/* Printer & Order Meta */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Printer Info */}
          <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/15 border border-emerald-100/60 dark:border-emerald-900/30 rounded-xl shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2.5">
              Printer Information
            </h4>
            <div className="space-y-1 text-xs">
              <div>
                <span className="text-slate-400 font-medium">
                  Printer Name:
                </span>{" "}
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {order.printer}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">
                  Printer Code:
                </span>{" "}
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {order.printerCode}
                </span>
              </div>
            </div>
          </div>

          {/* Work Order Info */}
          <div className="p-4 bg-blue-50/40 dark:bg-blue-950/15 border border-blue-100/60 dark:border-blue-900/30 rounded-xl shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400 mb-2.5">
              Printing Job / Book details
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Book:</span>{" "}
                <span className="font-bold block">
                  {order.bookTitle || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Class:</span>{" "}
                <span className="font-semibold block">
                  {order.classLevel || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Subject:</span>{" "}
                <span className="font-semibold block">
                  {order.subject || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">
                  Print Copies:
                </span>{" "}
                <span className="font-bold block text-blue-700 dark:text-blue-400">
                  {order.requiredQty?.toLocaleString() || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Paper Requirements Calculation & Progress */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700 rounded-xl shadow-xs">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-4">
            Paper Allocation Status
          </h4>

          <div className="grid grid-cols-3 gap-4 text-center mb-5">
            <div className="p-3 bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Required Paper
              </span>
              <span className="block text-lg font-black text-slate-800 dark:text-slate-100 mt-1">
                {totalRequired.toLocaleString()} MT
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Already Issued
              </span>
              <span className="block text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {totalIssued.toLocaleString()} MT
              </span>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 rounded-lg">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Remaining
              </span>
              <span
                className={`block text-lg font-black mt-1 ${remaining > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-400"}`}
              >
                {remaining.toLocaleString()} MT
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-500">
                Allocation Progress
              </span>
              <span className="font-bold text-slate-700 dark:text-slate-200">
                {progressPercent}%
              </span>
            </div>
            <progress
              value={progressPercent}
              max={100}
              className="w-full h-3.5 rounded-full overflow-hidden [&::-webkit-progress-bar]:bg-slate-200 dark:[&::-webkit-progress-bar]:bg-slate-700 [&::-webkit-progress-value]:bg-emerald-500 [&::-moz-progress-bar]:bg-emerald-500"
            />
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold pt-1">
              <span>0% Issued</span>
              <span>
                {totalIssued.toLocaleString()} /{" "}
                {totalRequired.toLocaleString()} MT
              </span>
              <span>100% Fully Issued</span>
            </div>
          </div>
        </div>

        {/* GSM-wise Requirements & Supply Breakdown */}
        <div className="space-y-3 p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-205 dark:border-slate-700 rounded-xl shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <i className="pi pi-th-large text-primary" />
            GSM-wise Allocation & Supply Breakdown
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-900/20">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2.5 px-4">GSM / Paper Type</th>
                  <th className="py-2.5 px-4 text-right">Required (MT)</th>
                  <th className="py-2.5 px-4 text-right">Issued (MT)</th>
                  <th className="py-2.5 px-4 text-right">Remaining (MT)</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-700">
                {gsmBreakdown.map((row) => {
                  const status =
                    row.pendingQty <= 0
                      ? "Completed"
                      : row.suppliedQty > 0
                        ? "Partial"
                        : "Pending";
                  const statusCls = {
                    Completed:
                      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-250",
                    Partial:
                      "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-250",
                    Pending:
                      "bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400 border border-slate-250",
                  }[status];

                  return (
                    <tr
                      key={`${row.gsm}_${row.paperType}`}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                    >
                      <td className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-205">
                        {row.gsm} GSM -{" "}
                        <span className="text-slate-500 font-normal">
                          {row.paperType}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-medium">
                        {row.approvedQty.toLocaleString()} MT
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {row.suppliedQty.toLocaleString()} MT
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-rose-600 dark:text-rose-450">
                        {row.pendingQty.toLocaleString()} MT
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${statusCls}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
}
