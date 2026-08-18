import { Card } from "shared/components/panels";
import { getPaperMaterialStatus } from "../printerDashboard.mock";

export default function PaperMaterialStatus({
  printerCode,
}: {
  printerCode: string;
}) {
  const status = getPaperMaterialStatus(printerCode);

  return (
    <Card className="p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-xs h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-black text-gray-800 dark:text-white flex items-center gap-2">
          <i className="pi pi-box text-[#4F8F70]" />
          Paper & Material Status
        </h3>
        <p className="text-xs font-medium text-gray-550 dark:text-gray-400 mt-0.5">
          Allocation, receipts, and consumption statistics of textbook paper
          reels
        </p>
      </div>

      {/* Grid of Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4 p-3.5 bg-gray-50 dark:bg-gray-850/50 rounded-2xl border border-gray-150/50 dark:border-gray-800/50">
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Allocated
          </span>
          <span className="text-lg font-black text-gray-800 dark:text-white block font-mono">
            {status.allocated.toFixed(2)} MT
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Received
          </span>
          <span className="text-lg font-black text-[#5FAF7A] block font-mono">
            {status.received.toFixed(2)} MT
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Consumed
          </span>
          <span className="text-lg font-black text-blue-600 dark:text-blue-405 block font-mono">
            {status.consumed.toFixed(2)} MT
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
            Available
          </span>
          <span className="text-lg font-black text-amber-600 dark:text-amber-400 block font-mono">
            {status.available.toFixed(2)} MT
          </span>
        </div>
      </div>

      {/* GSM Details Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-200/80 dark:border-gray-700/80 text-[10px] uppercase font-bold tracking-widest text-gray-400 pb-2">
              <th className="py-2.5 font-bold">GSM</th>
              <th className="py-2.5 text-right font-bold">Allocated</th>
              <th className="py-2.5 text-right font-bold">Received</th>
              <th className="py-2.5 text-right font-bold">Used</th>
              <th className="py-2.5 text-right font-bold">Available</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150/40 dark:divide-gray-800/40 text-xs font-semibold">
            {status.gsmTable.map((g) => (
              <tr
                key={g.gsm}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-850/10"
              >
                <td className="py-3 font-bold text-gray-800 dark:text-gray-200">
                  {g.gsm}
                </td>
                <td className="py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                  {g.allocated.toFixed(2)} MT
                </td>
                <td className="py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                  {g.received.toFixed(2)} MT
                </td>
                <td className="py-3 text-right font-mono text-gray-700 dark:text-gray-300">
                  {g.used.toFixed(2)} MT
                </td>
                <td className="py-3 text-right font-mono text-gray-800 dark:text-white">
                  {g.available.toFixed(2)} MT
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Low Stock Alert Banner */}
      <div className="mt-4 bg-amber-50/55 dark:bg-amber-950/10 border border-amber-250/70 rounded-xl p-3.5 flex items-start gap-3">
        <i className="pi pi-exclamation-triangle text-amber-600 dark:text-amber-400 text-lg mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300">
            Low Stock Alert
          </h4>
          <p className="text-[11px] text-amber-700 dark:text-amber-400/90 font-medium mt-0.5">
            80 GSM paper is below required level. Please coordinate with depot
            for dispatch.
          </p>
        </div>
      </div>
    </Card>
  );
}
