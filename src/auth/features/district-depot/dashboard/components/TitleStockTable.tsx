import { Card } from "shared/components/panels";
import type { TitleStockItem } from "../data";

interface Props {
  data: TitleStockItem[];
}

export function TitleStockTable({ data }: Props) {
  return (
    <Card className="overflow-hidden p-0 border border-gray-200/60 dark:border-gray-700/60 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/40">
        <div>
          <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
            <i className="pi pi-book text-indigo-600 dark:text-indigo-400 text-lg" />
            Title-wise Stock Position
          </h3>
        </div>
        <span className="text-xs bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full font-black border border-indigo-200 dark:border-indigo-900/50">
          {data.length} Titles
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100/70 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
              <th className="px-4 py-3 text-left">
                #
              </th>
              <th className="px-4 py-3 text-left min-w-[190px]">
                Title
              </th>
              <th className="px-4 py-3 text-left">
                Class
              </th>
              <th className="px-4 py-3 text-left">
                Medium
              </th>
              <th className="px-4 py-3 text-right">
                Received
              </th>
              <th className="px-4 py-3 text-right">
                Issued
              </th>
              <th className="px-4 py-3 text-right">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150/60 dark:divide-gray-800/60">
            {data.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors"
              >
                <td className="px-4 py-3 font-semibold text-gray-500 dark:text-gray-400">
                  {row.id}
                </td>
                <td className="px-4 py-3 font-extrabold text-gray-900 dark:text-white">
                  {row.title}
                </td>
                <td className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">
                  {row.classGroup}
                </td>
                <td className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">
                  {row.medium}
                </td>
                <td className="px-4 py-3 text-right font-extrabold font-mono text-blue-700 dark:text-blue-400">
                  {row.receivedQty.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-extrabold font-mono text-amber-700 dark:text-amber-400">
                  {row.issuedQty.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-black font-mono text-emerald-700 dark:text-emerald-400">
                  {row.balanceQty.toLocaleString()}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100/80 dark:bg-gray-800/90 font-black text-base border-t-2 border-gray-300 dark:border-gray-700">
              <td
                colSpan={4}
                className="px-4 py-3.5 text-gray-900 dark:text-white uppercase tracking-wider text-xs"
              >
                Total
              </td>
              <td className="px-4 py-3.5 text-right font-mono text-blue-800 dark:text-blue-300">
                {data.reduce((s, r) => s + r.receivedQty, 0).toLocaleString()}
              </td>
              <td className="px-4 py-3.5 text-right font-mono text-amber-800 dark:text-amber-300">
                {data.reduce((s, r) => s + r.issuedQty, 0).toLocaleString()}
              </td>
              <td className="px-4 py-3.5 text-right font-mono text-emerald-800 dark:text-emerald-300">
                {data.reduce((s, r) => s + r.balanceQty, 0).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
