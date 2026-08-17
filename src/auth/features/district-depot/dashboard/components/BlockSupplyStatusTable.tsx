import { Card } from "shared/components/panels";
import type { BlockSupplyItem, ActivityItem } from "../data";

// ─── Block Supply Status Table ────────────────────────────────────────────────
interface BlockSupplyProps {
  data: BlockSupplyItem[];
}

function StatusBadge({ status }: { status: BlockSupplyItem["status"] }) {
  const cls = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Dispatched: "bg-blue-50 text-blue-700 border-blue-200",
    Acknowledged: "bg-emerald-50 text-emerald-700 border-emerald-200",
  }[status];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${cls}`}
    >
      {status}
    </span>
  );
}

export function BlockSupplyStatusTable({ data }: BlockSupplyProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-0">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i className="pi pi-map-marker text-amber-600 dark:text-amber-400" />
            Block-wise Supply Status
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Recent dispatch status to blocks / BRC centres
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700">
              <th className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-400">
                #
              </th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-400">
                Block
              </th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-400">
                Challan No
              </th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-400">
                Date
              </th>
              <th className="px-3 py-2.5 text-right font-semibold text-gray-600 dark:text-gray-400">
                Qty
              </th>
              <th className="px-3 py-2.5 text-center font-semibold text-gray-600 dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-50 dark:border-gray-800 hover:bg-amber-50/40 dark:hover:bg-amber-950/10 transition-colors"
              >
                <td className="px-3 py-2 text-gray-400">{row.id}</td>
                <td className="px-3 py-2 font-semibold text-gray-800 dark:text-gray-200">
                  {row.block}
                </td>
                <td className="px-3 py-2 text-gray-600 dark:text-gray-400 font-mono text-[11px]">
                  {row.challanNo}
                </td>
                <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                  {row.date}
                </td>
                <td className="px-3 py-2 text-right font-bold text-gray-800 dark:text-gray-200">
                  {row.qty.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-center">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ─── Recent Activities ────────────────────────────────────────────────────────
interface RecentActivitiesProps {
  activities: ActivityItem[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <Card className="overflow-hidden">
      <div className="pb-3 border-b border-gray-100 dark:border-gray-800 mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <i className="pi pi-clock text-purple-600 dark:text-purple-400" />
          Recent Activities
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start gap-3">
            <div
              className={`w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 ${act.color}`}
            >
              <i className={`${act.icon} text-xs`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                {act.action}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {act.detail}
              </p>
            </div>
            <span className="text-[10px] text-gray-400 shrink-0">
              {act.time}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
