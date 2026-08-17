import { Card } from "shared/components/panels";
import type { TitleStockItem } from "../data";

interface Props {
  data: TitleStockItem[];
}

export function TitleStockTable({ data }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-0">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <i className="pi pi-book text-indigo-600 dark:text-indigo-400" />
            Title-wise Stock Position
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Current inventory breakdown by textbook title
          </p>
        </div>
        <span className="text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-semibold border border-indigo-100 dark:border-indigo-900/50">
          {data.length} Titles
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700">
              <th className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-400">
                #
              </th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-400 min-w-[180px]">
                Title
              </th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-400">
                Class
              </th>
              <th className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-400">
                Medium
              </th>
              <th className="px-3 py-2.5 text-right font-semibold text-gray-600 dark:text-gray-400">
                Received
              </th>
              <th className="px-3 py-2.5 text-right font-semibold text-gray-600 dark:text-gray-400">
                Issued
              </th>
              <th className="px-3 py-2.5 text-right font-semibold text-gray-600 dark:text-gray-400">
                Balance
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-50 dark:border-gray-800 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors"
              >
                <td className="px-3 py-2 text-gray-400 dark:text-gray-500">
                  {row.id}
                </td>
                <td className="px-3 py-2 font-medium text-gray-800 dark:text-gray-200">
                  {row.title}
                </td>
                <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                  {row.classGroup}
                </td>
                <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                  {row.medium}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-blue-700 dark:text-blue-400">
                  {row.receivedQty.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-amber-700 dark:text-amber-400">
                  {row.issuedQty.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-right font-bold text-emerald-700 dark:text-emerald-400">
                  {row.balanceQty.toLocaleString()}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 dark:bg-gray-800/60 font-bold">
              <td
                colSpan={4}
                className="px-3 py-2 text-gray-700 dark:text-gray-300"
              >
                Total
              </td>
              <td className="px-3 py-2 text-right text-blue-800 dark:text-blue-300">
                {data.reduce((s, r) => s + r.receivedQty, 0).toLocaleString()}
              </td>
              <td className="px-3 py-2 text-right text-amber-800 dark:text-amber-300">
                {data.reduce((s, r) => s + r.issuedQty, 0).toLocaleString()}
              </td>
              <td className="px-3 py-2 text-right text-emerald-800 dark:text-emerald-300">
                {data.reduce((s, r) => s + r.balanceQty, 0).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
