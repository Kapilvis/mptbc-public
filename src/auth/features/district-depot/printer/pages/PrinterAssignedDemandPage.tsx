import { useState } from "react";
import Page from "shared/components/panels/Page";
import { Card } from "shared/components/panels";
import { printerDemandData, type PrinterDemandItem } from "../data";
import { depotDropdownItems, academicYears, printerList } from "../../data";

function StatusBadge({ status }: { status: PrinterDemandItem["status"] }) {
  const cls = {
    "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Delayed: "bg-rose-50 text-rose-700 border-rose-200",
  }[status];
  const icon = {
    "In Progress": "pi-spin pi-spinner",
    Completed: "pi-check-circle",
    Delayed: "pi-exclamation-triangle",
  }[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${cls}`}
    >
      <i className={`pi ${icon} text-[9px]`} />
      {status}
    </span>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 100 : Math.min(Math.round((value / max) * 100), 100);
  const color =
    pct === 100 ? "bg-emerald-500" : pct >= 70 ? "bg-blue-500" : "bg-rose-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 w-8 text-right">
        {pct}%
      </span>
    </div>
  );
}

export default function PrinterAssignedDemandPage() {
  const [year, setYear] = useState("2026-2027");
  const [depot, setDepot] = useState("");
  const [printer, setPrinter] = useState("");
  const [search, setSearch] = useState("");

  const filtered = printerDemandData.filter((r) => {
    const matchSearch =
      !search ||
      r.printerName.toLowerCase().includes(search.toLowerCase()) ||
      r.jobCode.toLowerCase().includes(search.toLowerCase());
    const matchPrinter = !printer || r.printerCode === printer;
    return matchSearch && matchPrinter;
  });

  const totals = filtered.reduce(
    (acc, r) => ({
      ordered: acc.ordered + r.totalOrdered,
      delivered: acc.delivered + r.deliveredToDepot,
      remaining: acc.remaining + r.remaining,
    }),
    { ordered: 0, delivered: 0, remaining: 0 },
  );

  return (
    <Page
      header="Printer Assigned Demand"
      subHeader="मुद्रक-वार कार्यादेश — Books ordered from each printer, delivered to depot, and remaining balance."
      showHeaderActions
    >
      {/* Summary KPI Strip */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {
            label: "Total Books Ordered",
            value: totals.ordered.toLocaleString(),
            icon: "pi pi-file-edit",
            color: "text-indigo-600",
            bg: "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100",
          },
          {
            label: "Delivered to Depot",
            value: totals.delivered.toLocaleString(),
            icon: "pi pi-inbox",
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-100",
          },
          {
            label: "Remaining",
            value: totals.remaining.toLocaleString(),
            icon: "pi pi-clock",
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-100",
          },
        ].map((kpi) => (
          <Card key={kpi.label} className={`border ${kpi.bg}`}>
            <div className="flex items-center gap-3 p-1">
              <i className={`${kpi.icon} text-xl ${kpi.color}`} />
              <div>
                <div className="text-lg font-extrabold text-gray-900 dark:text-white">
                  {kpi.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {kpi.label}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            {academicYears.map((y) => (
              <option key={y.id} value={y.id}>
                {y.text}
              </option>
            ))}
          </select>
          <select
            value={depot}
            onChange={(e) => setDepot(e.target.value)}
            className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="">All Depots</option>
            {depotDropdownItems.map((d) => (
              <option key={d.id} value={d.id}>
                {d.text}
              </option>
            ))}
          </select>
          <select
            value={printer}
            onChange={(e) => setPrinter(e.target.value)}
            className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="">All Printers</option>
            {printerList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.text}
              </option>
            ))}
          </select>
          <div className="flex-1 flex justify-end">
            <div className="relative">
              <i className="pi pi-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search printer or job code..."
                className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 w-60"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-700">
                {[
                  "#",
                  "Printer Name",
                  "Group No",
                  "Job Code",
                  "Total Ordered",
                  "Delivered to Depot",
                  "Remaining",
                  "% Complete",
                  "Last Delivery",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-50 dark:border-gray-800 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-colors"
                >
                  <td className="px-3 py-2.5 text-gray-400">{row.id}</td>
                  <td className="px-3 py-2.5 font-semibold text-gray-800 dark:text-gray-200 min-w-[200px]">
                    {row.printerName}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 font-mono">
                    {row.groupNo}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 font-mono">
                    {row.jobCode}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-indigo-700 dark:text-indigo-400">
                    {row.totalOrdered.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-blue-700 dark:text-blue-400">
                    {row.deliveredToDepot.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-amber-700 dark:text-amber-400">
                    {row.remaining.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 min-w-[140px]">
                    <ProgressBar
                      value={row.deliveredToDepot}
                      max={row.totalOrdered}
                    />
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {row.lastDeliveryDate}
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="bg-gray-50 dark:bg-gray-800/60 font-bold border-t-2 border-gray-200 dark:border-gray-700">
                <td
                  colSpan={4}
                  className="px-3 py-2.5 text-gray-700 dark:text-gray-300"
                >
                  Total ({filtered.length} Printers)
                </td>
                <td className="px-3 py-2.5 text-right text-indigo-800 dark:text-indigo-300">
                  {totals.ordered.toLocaleString()}
                </td>
                <td className="px-3 py-2.5 text-right text-blue-800 dark:text-blue-300">
                  {totals.delivered.toLocaleString()}
                </td>
                <td className="px-3 py-2.5 text-right text-amber-800 dark:text-amber-300">
                  {totals.remaining.toLocaleString()}
                </td>
                <td colSpan={3} />
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </Page>
  );
}
