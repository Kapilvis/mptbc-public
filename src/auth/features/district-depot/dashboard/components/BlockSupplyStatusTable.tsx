import { Card } from "shared/components/panels";
import type { BlockSupplyItem, ActivityItem } from "../data";

// ─── Block Supply Status Table ────────────────────────────────────────────────
interface BlockSupplyProps {
  data: BlockSupplyItem[];
}

function StatusBadge({ status }: { status: BlockSupplyItem["status"] }) {
  const cls = {
    Pending:
      "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300",
    Dispatched:
      "bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300",
    Acknowledged:
      "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300",
  }[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${cls}`}
    >
      {status}
    </span>
  );
}

export function BlockSupplyStatusTable({ data }: BlockSupplyProps) {
  return (
    <Card className="overflow-hidden p-0 border border-gray-200/60 dark:border-gray-700/60 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/40">
        <div>
          <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
            <i className="pi pi-map-marker text-amber-600 dark:text-amber-400 text-lg" />
            Block-wise Supply Status
          </h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100/70 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Block</th>
              <th className="px-4 py-3 text-left">Challan No</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-right">Qty</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150/60 dark:divide-gray-800/60">
            {data.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">
                  {row.id}
                </td>
                <td className="px-4 py-3 font-extrabold text-gray-900 dark:text-white">
                  {row.block}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300 font-mono font-bold text-xs">
                  {row.challanNo}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                  {row.date}
                </td>
                <td className="px-4 py-3 text-right font-extrabold font-mono text-gray-900 dark:text-white">
                  {row.qty.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
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
