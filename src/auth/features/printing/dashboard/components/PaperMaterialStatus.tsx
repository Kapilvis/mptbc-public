import { Card } from "shared/components/panels";
import { getPaperMaterialStatus } from "../printerDashboard.mock";

export default function PaperMaterialStatus({
  printerCode,
}: {
  printerCode: string;
}) {
  const status = getPaperMaterialStatus(printerCode);

  return (
    <Card className="p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-xs h-full flex flex-col justify-between border-t-transparent! relative overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Premium top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-600 z-20" />

      <div>
        <h3 className="text-base font-black text-gray-800 dark:text-white flex items-center gap-2">
          <i className="pi pi-box text-[#4F8F70]" />
          Paper & Material Status
        </h3>
      </div>

      {/* Grid of Summary Stats - Redesigned into individual styled cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4">
        {/* Allocated */}
        <div className="bg-blue-50/40 dark:bg-blue-950/15 border border-blue-200/50 dark:border-blue-900/30 p-3 rounded-xl transition-all duration-200 hover:bg-blue-50/70">
          <span className="text-[11px] uppercase font-black text-blue-750 dark:text-blue-400 block tracking-wider">
            Allocated
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-blue-105 block font-mono mt-0.5">
            {Math.round(status.allocated)} MT
          </span>
        </div>

        {/* Received */}
        <div className="bg-emerald-50/40 dark:bg-emerald-950/15 border border-emerald-200/50 dark:border-emerald-900/30 p-3 rounded-xl transition-all duration-200 hover:bg-emerald-50/70">
          <span className="text-[11px] uppercase font-black text-emerald-750 dark:text-emerald-400 block tracking-wider">
            Received
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-emerald-105 block font-mono mt-0.5">
            {Math.round(status.received)} MT
          </span>
        </div>

        {/* Consumed */}
        <div className="bg-indigo-50/40 dark:bg-indigo-950/15 border border-indigo-200/50 dark:border-indigo-900/30 p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50/70">
          <span className="text-[11px] uppercase font-black text-indigo-750 dark:text-indigo-400 block tracking-wider">
            Consumed
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-indigo-105 block font-mono mt-0.5">
            {Math.round(status.consumed)} MT
          </span>
        </div>

        {/* Available */}
        <div className="bg-amber-50/40 dark:bg-amber-950/15 border border-amber-250/50 dark:border-amber-900/30 p-3 rounded-xl transition-all duration-200 hover:bg-amber-50/70">
          <span className="text-[11px] uppercase font-black text-amber-850 dark:text-amber-400 block tracking-wider">
            Available
          </span>
          <span className="text-lg font-black text-slate-900 dark:text-amber-105 block font-mono mt-0.5">
            {Math.round(status.available)} MT
          </span>
        </div>
      </div>

      {/* GSM Details Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-125">
          <thead>
            <tr className="border-b border-gray-200/80 dark:border-gray-700/80 text-[10px] uppercase font-black tracking-widest text-slate-650 dark:text-slate-400 pb-2">
              <th className="py-2.5 pl-2">GSM</th>
              <th className="py-2.5 text-right">Allocated</th>
              <th className="py-2.5 text-right">Received</th>
              <th className="py-2.5 text-right">Used</th>
              <th className="py-2.5 text-right pr-2">Available</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150/40 dark:divide-gray-800/40 text-sm">
            {status.gsmTable.map((g) => (
              <tr
                key={g.gsm}
                className="group hover:bg-[#E8F4EC]/35 dark:hover:bg-[#4F8F70]/5 transition-all duration-150"
              >
                <td className="py-3.5 font-extrabold text-slate-900 dark:text-gray-100 pl-2">
                  {g.gsm}
                </td>
                <td className="py-3.5 text-right font-extrabold font-mono text-slate-900 dark:text-gray-200">
                  {Math.round(g.allocated)} MT
                </td>
                <td className="py-3.5 text-right font-extrabold font-mono text-slate-900 dark:text-gray-200">
                  {Math.round(g.received)} MT
                </td>
                <td className="py-3.5 text-right font-extrabold font-mono text-slate-900 dark:text-gray-200">
                  {Math.round(g.used)} MT
                </td>
                <td className="py-3.5 text-right font-black font-mono text-slate-900 dark:text-white pr-2">
                  {Math.round(g.available)} MT
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


    </Card>
  );
}
