import { Button } from "shared/components/buttons";
import { GridPanel } from "shared/components/panels";
import { formatDate } from "shared/utils/dateUtils";
import type { OpeningStockItem } from "../data";

interface OpeningStockGridProps {
  data: OpeningStockItem[];
  loading?: boolean;
  onApproveStock: (item: OpeningStockItem) => void;
}

export function OpeningStockGrid({
  data,
  loading = false,
  onApproveStock,
}: OpeningStockGridProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <i className="pi pi-box text-emerald-600 dark:text-emerald-400" />
            Depot-Wise Opening Stock Inventory & Carried-Over Demand Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            End-of-year physical inventory audit records calculated from
            receipts, dispatches, and inter-depot stock balancing
          </p>
        </div>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
          Total Depots: {data.length} Records
        </span>
      </div>

      <GridPanel<OpeningStockItem>
        data={data}
        loading={loading}
        searchFields={["depotName", "division", "titleName", "warehouseBay"]}
        columns={[
          {
            cell: (_, opt) => <span>{opt.rowIndex + 1}</span>,
            header: "S.NO.",
            width: "40px",
            align: "center",
          },
          {
            field: "depotName",
            header: "DEPOT & DIVISION",
            cell: (row) => (
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {row.depotName}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  {row.division} Div • Bay: {row.warehouseBay}
                </div>
              </div>
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
                  {row.classGroup} ({row.medium})
                </div>
              </div>
            ),
          },
          {
            field: "totalDeliveredQty",
            header: "RECEIPTS - SENT",
            align: "right",
            cell: (row) => (
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {row.totalDeliveredQty.toLocaleString()} Recd
                </div>
                <div className="text-[10px] text-slate-500">
                  {row.totalDispatchedQty.toLocaleString()} Dispatched
                </div>
              </div>
            ),
          },
          {
            field: "netInterDepotQty",
            header: "INTER-DEPOT BALANCING",
            align: "center",
            cell: (row) => (
              <span
                className={`font-bold text-xs ${
                  row.netInterDepotQty > 0
                    ? "text-emerald-700 dark:text-emerald-400"
                    : row.netInterDepotQty < 0
                      ? "text-rose-700 dark:text-rose-400"
                      : "text-slate-500"
                }`}
              >
                {row.netInterDepotQty > 0
                  ? `+${row.netInterDepotQty.toLocaleString()}`
                  : row.netInterDepotQty.toLocaleString()}
              </span>
            ),
          },
          {
            field: "calculatedOpeningStockQty",
            header: "CALCULATED OPENING STOCK",
            align: "right",
            cell: (row) => (
              <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm block">
                {row.calculatedOpeningStockQty.toLocaleString()} Books
              </span>
            ),
          },
          {
            field: "status",
            header: "HO APPROVAL STATUS",
            align: "center",
            cell: (row) => (
              <div>
                <span
                  className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    row.status === "HO_APPROVED"
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                      : "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                  }`}
                >
                  {row.status === "HO_APPROVED"
                    ? "HO APPROVED & CONSOLIDATED"
                    : "PENDING HO APPROVAL"}
                </span>
                {row.approvedDate && (
                  <div className="text-[9.5px] text-slate-500 font-medium mt-0.5">
                    On {formatDate(row.approvedDate)}
                  </div>
                )}
              </div>
            ),
          },
          {
            header: "ACTION",
            align: "center",
            cell: (row) =>
              row.status === "PENDING_APPROVAL" ? (
                <Button
                  label="Approve Stock"
                  icon="pi pi-check"
                  size="small"
                  variant="primary"
                  onClick={() => onApproveStock(row)}
                />
              ) : (
                <Button
                  label="View Audit"
                  icon="pi pi-search"
                  size="small"
                  variant="outlined"
                  onClick={() => onApproveStock(row)}
                />
              ),
          },
        ]}
      />
    </div>
  );
}
