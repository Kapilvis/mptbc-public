import { Button } from "shared/components/buttons";
import { GridPanel } from "shared/components/panels";
import type { DeficitDepotNeedItem } from "../data";

interface DeficitDepotsGridProps {
  data: DeficitDepotNeedItem[];
  loading?: boolean;
  onFulfillNeed: (item: DeficitDepotNeedItem) => void;
}

export function DeficitDepotsGrid({
  data,
  loading = false,
  onFulfillNeed,
}: DeficitDepotsGridProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-2xl shadow-2xs overflow-hidden">
      <div className="p-4 bg-rose-50/80 dark:bg-rose-950/30 border-b border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-rose-950 dark:text-rose-200 uppercase tracking-wider flex items-center gap-2">
            <i className="pi pi-exclamation-triangle text-rose-600 dark:text-rose-400" />
            Deficit Depots (Shortage Needs)
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-400 font-medium mt-0.5">
            Depots requiring additional copies for their block demands
          </p>
        </div>
        <span className="text-xs font-extrabold bg-rose-100 dark:bg-rose-900/60 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800 px-2.5 py-1 rounded-full">
          {data.length} Needing Stock
        </span>
      </div>

      <div className="p-2">
        <GridPanel<DeficitDepotNeedItem>
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
              header: "DEPOT & DIVISION",
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
              field: "blockDemand",
              header: "DEMAND VS STOCK",
              align: "right",
              cell: (row) => (
                <div>
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {row.blockDemand.toLocaleString()} Demand
                  </div>
                  <div className="text-[10px] text-rose-700 dark:text-rose-400 font-bold">
                    {row.currentStock.toLocaleString()} Stock
                  </div>
                </div>
              ),
            },
            {
              header: "ACTION",
              align: "center",
              cell: (row) => (
                <Button
                  label="Fulfill Need"
                  icon="pi pi-[#006A38] pi-arrow-right-arrow-left"
                  size="small"
                  variant="outlined"
                  onClick={() => onFulfillNeed(row)}
                />
              ),
            },
            {
              field: "deficitQty",
              header: "DEFICIT QTY",
              align: "right",
              cell: (row) => (
                <span className="font-black text-rose-700 dark:text-rose-400 text-sm">
                  -{row.deficitQty.toLocaleString()}
                </span>
              ),
            },
            {
              field: "urgencyLevel",
              header: "URGENCY",
              align: "center",
              cell: (row) => (
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    row.urgencyLevel === "CRITICAL"
                      ? "bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                      : row.urgencyLevel === "HIGH"
                        ? "bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                        : "bg-blue-100 text-blue-900 border border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800"
                  }`}
                >
                  {row.urgencyLevel}
                </span>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
