import { Card } from "shared/components/panels";
import type { PrinterReceiptData } from "../data";

interface Props {
  data: PrinterReceiptData[];
}

export function PrinterReceiptBarChart({ data }: Props) {
  const maxVal = Math.max(...data.map((d) => d.delivered + d.remaining));

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-4">
        <div>
          <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
            <i className="pi pi-print text-blue-600 dark:text-blue-400 text-lg" />
            Printer-wise Allotment
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-extrabold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-gray-700 dark:text-gray-200">Delivered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-100 border border-blue-300 dark:bg-blue-900 dark:border-blue-700" />
            <span className="text-gray-700 dark:text-gray-200">Remaining</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
        {data.map((row, i) => {
          const total = row.delivered + row.remaining;
          const pct = Math.round((row.delivered / total) * 100);
          return (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[140px]">
                  {row.printer}
                </span>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400">
                  {pct}%
                </span>
              </div>
              <div className="relative h-5 rounded-full bg-blue-50 dark:bg-blue-950/30 overflow-hidden border border-blue-100 dark:border-blue-900/40">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-700"
                  style={{ width: `${(row.delivered / maxVal) * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-end pr-2">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                    {row.delivered.toLocaleString()} / {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
