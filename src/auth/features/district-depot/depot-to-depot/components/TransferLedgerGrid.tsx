import { Button } from "shared/components/buttons";
import { GridPanel } from "shared/components/panels";
import { formatDate } from "shared/utils/dateUtils";
import type { InterDepotTransferOrder } from "../data";

interface TransferLedgerGridProps {
  data: InterDepotTransferOrder[];
  loading?: boolean;
  onViewGatepass: (order: InterDepotTransferOrder) => void;
}

export function TransferLedgerGrid({
  data,
  loading = false,
  onViewGatepass,
}: TransferLedgerGridProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <i className="pi pi-file text-emerald-600 dark:text-emerald-400" />
            Inter-Depot Stock Transfer Audit Ledger (FY 2026-2027)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Live audit record of sanctioned inter-depot textbook transfers with
            official Gatepass Challans
          </p>
        </div>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          Total Sanctioned: {data.length} Orders
        </span>
      </div>

      <GridPanel<InterDepotTransferOrder>
        data={data}
        loading={loading}
        searchFields={[
          "transferId",
          "sourceDepotName",
          "targetDepotName",
          "titleName",
          "transitVehicleNo",
        ]}
        columns={[
          {
            cell: (_, opt) => <span>{opt.rowIndex + 1}</span>,
            width: "40px",
            align: "center",
          },
          {
            field: "transferId",
            header: "CHALLAN ID",
            cell: (row) => (
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                {row.transferId}
              </span>
            ),
          },
          {
            field: "sourceDepotName",
            header: "SOURCE DEPOT (SURPLUS)",
            cell: (row) => (
              <span className="font-bold text-emerald-900 dark:text-emerald-300">
                {row.sourceDepotName}
              </span>
            ),
          },
          {
            field: "targetDepotName",
            header: "TARGET DEPOT (DEFICIT)",
            cell: (row) => (
              <span className="font-bold text-rose-900 dark:text-rose-300">
                {row.targetDepotName}
              </span>
            ),
          },
          {
            field: "titleName",
            header: "TEXTBOOK TITLE",
            cell: (row) => (
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {row.titleName}
                </div>
                <div className="text-[10px] text-slate-500 font-normal">
                  {row.classGroup}
                </div>
              </div>
            ),
          },
          {
            field: "transferredQty",
            header: "COPIES",
            align: "right",
            cell: (row) => (
              <span className="font-black text-slate-900 dark:text-white text-sm">
                {row.transferredQty.toLocaleString()}
              </span>
            ),
          },
          {
            field: "transitVehicleNo",
            header: "VEHICLE NO",
            cell: (row) => (
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                {row.transitVehicleNo}
              </span>
            ),
          },
          {
            field: "sanctionDate",
            header: "SANCTION DATE",
            align: "center",
            cell: (row) => (
              <span className="text-slate-700 dark:text-slate-300 text-xs font-bold">
                {formatDate(row.sanctionDate)}
              </span>
            ),
          },
          {
            field: "status",
            header: "STATUS",
            align: "center",
            cell: (row) => (
              <span
                className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  row.status === "RECEIVED_ACKNOWLEDGED"
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                    : row.status === "DISPATCHED_IN_TRANSIT"
                      ? "bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                      : "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                }`}
              >
                {row.status.replace("_", " ")}
              </span>
            ),
          },
          {
            header: "GATEPASS",
            align: "center",
            cell: (row) => (
              <Button
                label="View Doc"
                icon="pi pi-file-pdf"
                size="small"
                variant="outlined"
                onClick={() => onViewGatepass(row)}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
