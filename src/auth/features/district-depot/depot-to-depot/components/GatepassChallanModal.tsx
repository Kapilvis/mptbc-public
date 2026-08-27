import { Button } from "shared/components/buttons";
import { Modal } from "shared/components/popups";
import { formatDate } from "shared/utils/dateUtils";
import type { InterDepotTransferOrder } from "../data";

interface GatepassChallanModalProps {
  order: InterDepotTransferOrder | null;
  onHide: () => void;
}

export function GatepassChallanModal({
  order,
  onHide,
}: GatepassChallanModalProps) {
  if (!order) return null;

  return (
    <Modal
      visible={Boolean(order)}
      onHide={onHide}
      header={`Official Gatepass Challan: ${order.transferId}`}
      size="medium"
    >
      <div className="p-2 space-y-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        {/* Challan Header */}
        <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-3">
          <h4 className="text-base font-black text-emerald-950 dark:text-emerald-300 uppercase">
            MADHYA PRADESH TEXTBOOK CORPORATION
          </h4>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
            Head Office, Arera Hills, Bhopal (M.P.)
          </span>
          <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 mt-1.5 inline-block">
            INTER-DEPOT STOCK TRANSFER CHALLAN: {order.transferId}
          </span>
        </div>

        {/* Grid Info */}
        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase block">
              SOURCE DEPOT (DISPATCH SENDER)
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white block">
              {order.sourceDepotName}
            </span>
            <span className="text-slate-600 dark:text-slate-400 block">
              Status: Dispatched & Transit Out
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase block">
              TARGET DEPOT (RECEIVER)
            </span>
            <span className="text-sm font-black text-slate-900 dark:text-white block">
              {order.targetDepotName}
            </span>
            <span className="text-slate-600 dark:text-slate-400 block">
              Vehicle: {order.transitVehicleNo}
            </span>
          </div>
        </div>

        {/* Details Table */}
        <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <thead className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-700 dark:text-slate-300">
            <tr>
              <th className="p-2.5">Textbook Title</th>
              <th className="p-2.5">Class Group</th>
              <th className="p-2.5 text-right">Transferred Copies</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200 dark:border-slate-700 font-bold">
              <td className="p-2.5">{order.titleName}</td>
              <td className="p-2.5">{order.classGroup}</td>
              <td className="p-2.5 text-right font-black text-sm text-emerald-700 dark:text-emerald-400">
                {order.transferredQty.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Authorization Note */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <span className="font-extrabold block">Sanctioned Authority:</span>
          <span>
            {order.sanctionedBy} on {formatDate(order.sanctionDate)}
          </span>
          <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1">
            Remarks: {order.transferReason}
          </span>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">
            System Generated Gatepass • MP TBC HO System
          </span>
          <div className="flex items-center gap-2">
            <Button label="Close" variant="outlined" onClick={onHide} />
            <Button
              label="Print Gatepass"
              icon="pi pi-print"
              variant="primary"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
