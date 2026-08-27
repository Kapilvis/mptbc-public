import { Button } from "shared/components/buttons";
import { GridPanel } from "shared/components/panels";
import type { SurplusDepotStockItem } from "../data";

interface SurplusDepotsGridProps {
  data: SurplusDepotStockItem[];
  loading?: boolean;
  onTransferStock: (item: SurplusDepotStockItem) => void;
}

export function SurplusDepotsGrid({
  data,
  loading = false,
  onTransferStock,
}: SurplusDepotsGridProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl shadow-2xs overflow-hidden">
      <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-2">
            <i className="pi pi-check-circle text-emerald-600 dark:text-emerald-400" />
            Surplus Depots (Available Excess Stock)
          </h3>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
            Depots with excess remaining stock available for transfer
          </p>
        </div>
        <span className="text-xs font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-full">
          {data.length} Depots Have Surplus
        </span>
      </div>

      <div className="p-2">
        <GridPanel<SurplusDepotStockItem>
          data={data}
          loading={loading}
          searchFields={["depotName", "titleName", "division", "classGroup"]}
          columns={[
            // {
            //   cell: (_, opt) => <span>{opt.rowIndex + 1}</span>,
            //   header: "S.NO.",
            //   width: "40px",
            //   align: "center",
            // },
            {
              field: "depotName",
              header: "DEPOT & LOCATION",
              cell: (row) => (
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {row.depotName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    {row.division} Div • {row.contactPerson}
                  </div>
                </div>
              ),
            },
            {
              field: "titleName",
              header: "TEXTBOOK TITLE",
              cell: (row) => (
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-slate-100">
                    {row.titleName}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {row.classGroup} ({row.medium})
                  </div>
                </div>
              ),
            },
            {
              field: "deliveredQty",
              header: "DELIVERED - SENT",
              align: "right",
              cell: (row) => (
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {row.deliveredQty.toLocaleString()} Recd
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {row.dispatchedQty.toLocaleString()} Sent
                  </div>
                </div>
              ),
            },
            {
              header: "ACTION",
              align: "center",
              cell: (row) => (
                <Button
                  label="Transfer Stock"
                  icon="pi pi-[#006A38] pi-share-alt"
                  size="small"
                  variant="primary"
                  onClick={() => onTransferStock(row)}
                />
              ),
            },
            {
              field: "remainingStockQty",
              header: "SURPLUS STOCK",
              align: "right",
              cell: (row) => (
                <span className="font-black text-emerald-700 dark:text-emerald-400 text-sm">
                  +{row.remainingStockQty.toLocaleString()}
                </span>
              ),
            },
            {
              field: "warehouseBay",
              header: "BAY LOCATION",
              align: "center",
              cell: (row) => (
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  {row.warehouseBay}
                </span>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
