import { useState } from "react";
import Page from "shared/components/panels/Page";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { Card } from "shared/components/panels";
import { Button } from "shared/components/buttons";
import { dispatchHistoryData, type DispatchHistoryItem } from "../data";
import { depotDropdownItems, academicYears, classGroups } from "../../data";
import { DepotToBlockReceiptModal } from "../components/DepotToBlockReceiptModal";

function StatusBadge({ status }: { status: 0 | 1 }) {
  return status === 1 ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 uppercase tracking-wide">
      <i className="pi pi-check-circle text-[9px]" /> Acknowledged
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-700 border-amber-200 uppercase tracking-wide">
      <i className="pi pi-clock text-[9px]" /> Pending
    </span>
  );
}

export default function DispatchHistoryPage() {
  const pageTitle = usePageTitle();
  const [year, setYear] = useState("2026-2027");
  const [depot, setDepot] = useState("");
  const [classGroup, setClassGroup] = useState("");
  const [search, setSearch] = useState("");
  const [receiptItem, setReceiptItem] = useState<DispatchHistoryItem | null>(
    null,
  );

  const filtered = dispatchHistoryData.filter((r) => {
    return (
      (!depot || r.depotCode === depot) &&
      (!classGroup || r.classGroup === classGroup) &&
      (!search ||
        r.challanNo.toLowerCase().includes(search.toLowerCase()) ||
        r.blockName.includes(search) ||
        r.depotName.includes(search) ||
        r.truckNo.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const totalBooks = filtered.reduce((s, r) => s + r.totalBooks, 0);
  const totalBundles = filtered.reduce((s, r) => s + r.totalBundles, 0);
  const acknowledged = filtered.filter((r) => r.status === 1).length;

  return (
    <Page
      header={pageTitle || "Dispatch History"}
      subHeader="डिपो से ब्लॉक प्रेषण — Complete history of challans dispatched from depot to blocks."
      showHeaderActions
    >
      {/* Summary Strip */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          {
            label: "Total Challans",
            value: filtered.length.toLocaleString(),
            icon: "pi pi-file",
            color: "text-indigo-600",
            bg: "bg-indigo-50 border-indigo-100",
          },
          {
            label: "Total Bundles",
            value: totalBundles.toLocaleString(),
            icon: "pi pi-box",
            color: "text-blue-600",
            bg: "bg-blue-50 border-blue-100",
          },
          {
            label: "Total Books",
            value: totalBooks.toLocaleString(),
            icon: "pi pi-book",
            color: "text-emerald-600",
            bg: "bg-emerald-50 border-emerald-100",
          },
          {
            label: "Acknowledged",
            value: `${acknowledged} / ${filtered.length}`,
            icon: "pi pi-check-circle",
            color: "text-green-600",
            bg: "bg-green-50 border-green-100",
          },
        ].map((kpi) => (
          <Card key={kpi.label} className={`border ${kpi.bg}`}>
            <div className="flex items-center gap-3 p-1">
              <i className={`${kpi.icon} text-xl ${kpi.color}`} />
              <div>
                <div className="text-base font-extrabold text-gray-900 dark:text-white">
                  {kpi.value}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                  {kpi.label}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
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
            value={classGroup}
            onChange={(e) => setClassGroup(e.target.value)}
            className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="">All Class Groups</option>
            {classGroups.map((c) => (
              <option key={c.id} value={c.id}>
                {c.text}
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
                placeholder="Search challan, block, truck..."
                className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 w-56"
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
                  "Sr.No",
                  "Year",
                  "Class Group",
                  "Depot",
                  "Block",
                  "Challan No",
                  "Date",
                  "Bundles",
                  "Books",
                  "Truck No",
                  "Status",
                  "Receipt",
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
                  key={row.srNo}
                  className="border-b border-gray-50 dark:border-gray-800 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10 transition-colors"
                >
                  <td className="px-3 py-2.5 text-gray-400">{row.srNo}</td>
                  <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">
                    {row.year}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400">
                    {row.classGroup}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="font-bold text-gray-800 dark:text-gray-200">
                      {row.depotCode}
                    </span>
                    <span className="text-gray-400 ml-1 text-[10px]">
                      ({row.depotName})
                    </span>
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-gray-800 dark:text-gray-200">
                    {row.blockName}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-gray-700 dark:text-gray-300">
                    {row.challanNo}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-blue-700 dark:text-blue-400">
                    {row.totalBundles.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-emerald-700 dark:text-emerald-400">
                    {row.totalBooks.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {row.truckNo}
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3 py-2.5">
                    <Button
                      onClick={() => setReceiptItem(row)}
                      label="View"
                      icon="pi pi-file-pdf"
                      size="small"
                      variant="success"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 dark:bg-gray-800/60 font-bold border-t-2 border-gray-200 dark:border-gray-700">
                <td
                  colSpan={7}
                  className="px-3 py-2.5 text-gray-700 dark:text-gray-300"
                >
                  Total ({filtered.length} Challans)
                </td>
                <td className="px-3 py-2.5 text-right text-blue-800 dark:text-blue-300">
                  {totalBundles.toLocaleString()}
                </td>
                <td className="px-3 py-2.5 text-right text-emerald-800 dark:text-emerald-300">
                  {totalBooks.toLocaleString()}
                </td>
                <td colSpan={3} />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {receiptItem && (
        <DepotToBlockReceiptModal
          item={receiptItem}
          onClose={() => setReceiptItem(null)}
        />
      )}
    </Page>
  );
}
