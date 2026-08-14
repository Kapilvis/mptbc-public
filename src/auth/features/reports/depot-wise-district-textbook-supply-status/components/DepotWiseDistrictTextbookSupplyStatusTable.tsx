import { useTranslation } from "react-i18next";

interface TableProps {
  data: Report.DepotWiseDistrictTextbookSupplyStatusRow[];
}

function isSubtotalRow(row: Report.DepotWiseDistrictTextbookSupplyStatusRow) {
  return row.districtName === "Depots Total";
}

function isGrandTotalRow(row: Report.DepotWiseDistrictTextbookSupplyStatusRow) {
  return (
    row.depotName === "All Depots" ||
    row.depotName === "Previous Day Supply" ||
    row.depotName === "Today Difference"
  );
}

function fmt(val: number | string) {
  const num = Number(val);
  if (isNaN(num) || val === "" || val === null) return "—";
  return num.toLocaleString("en-IN");
}

function fmtPct(val: number | string) {
  const num = Number(val);
  if (isNaN(num) || val === "" || val === null) return "—";
  return `${num.toFixed(2)}%`;
}

function supplyPctClass(val: number | string, isGrand: boolean): string {
  if (isGrand) return "";
  const num = Number(val);
  if (isNaN(num)) return "";
  if (num >= 100) return "text-emerald-700 font-semibold";
  if (num >= 90) return "text-amber-600 font-semibold";
  return "text-red-600 font-semibold";
}

// ── Group consecutive rows by depotName ─────────────────────────────────────
interface DepotGroup {
  depotName: string;
  rows: Report.DepotWiseDistrictTextbookSupplyStatusRow[];
}

function groupByDepot(
  data: Report.DepotWiseDistrictTextbookSupplyStatusRow[],
): DepotGroup[] {
  const groups: DepotGroup[] = [];
  for (const row of data) {
    const last = groups[groups.length - 1];
    if (last && last.depotName === row.depotName) {
      last.rows.push(row);
    } else {
      groups.push({ depotName: row.depotName, rows: [row] });
    }
  }
  return groups;
}

export default function DepotWiseDistrictTextbookSupplyStatusTable({
  data,
}: TableProps) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <i className="pi pi-inbox mb-3 text-4xl" />
        <p className="text-sm font-medium">
          {t("reports.supply_status.table.no_records")}
        </p>
      </div>
    );
  }

  const groups = groupByDepot(data);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Scrollable table */}
      <div className="custom-scrollbar overflow-x-auto">
        <table className="w-full min-w-350 border-collapse text-xs">
          {/* ── Two-row grouped header ────────────────────────────────── */}
          <thead>
            <tr className="bg-table-header text-[11px] font-bold uppercase tracking-wide text-white">
              <th
                rowSpan={2}
                className="bg-table-header sticky left-0 z-20 w-10 border border-green-700 px-2 py-2 text-center"
              >
                {t("reports.supply_status.table.headers.s_no")}
              </th>
              <th
                rowSpan={2}
                className="bg-table-header sticky left-10 z-20 min-w-27.5 border border-green-700 px-3 py-2 text-left"
              >
                {t("reports.supply_status.table.headers.depot")}
              </th>
              <th
                rowSpan={2}
                className="min-w-25 border border-green-700 px-3 py-2 text-right"
              >
                {t("reports.supply_status.table.headers.general_sale")}
              </th>
              <th
                rowSpan={2}
                className="min-w-30 border border-green-700 px-3 py-2 text-left"
              >
                {t("reports.supply_status.table.headers.district_name")}
              </th>
              <th
                colSpan={3}
                className="border border-green-700 px-3 py-1.5 text-center"
              >
                {t("reports.supply_status.table.headers.scheme_1_8")}
              </th>
              <th
                colSpan={3}
                className="border border-green-700 px-3 py-1.5 text-center"
              >
                {t("reports.supply_status.table.headers.scheme_9_12")}
              </th>
              <th
                colSpan={3}
                className="border border-green-700 px-3 py-1.5 text-center"
              >
                {t("reports.supply_status.table.headers.total_scheme")}
              </th>
            </tr>
            <tr className="bg-table-header text-[10px] font-semibold text-white">
              <th className="min-w-22.5 border border-green-700 px-2 py-1.5 text-right">
                {t("reports.supply_status.table.headers.demand")}
              </th>
              <th className="min-w-22.5 border border-green-700 px-2 py-1.5 text-right">
                {t("reports.supply_status.table.headers.supply")}
              </th>
              <th className="min-w-17.5 border border-green-700 px-2 py-1.5 text-center">
                {t("reports.supply_status.table.headers.supply_percent")}
              </th>
              <th className="min-w-22.5 border border-green-700 px-2 py-1.5 text-right">
                {t("reports.supply_status.table.headers.demand")}
              </th>
              <th className="min-w-22.5 border border-green-700 px-2 py-1.5 text-right">
                {t("reports.supply_status.table.headers.supply")}
              </th>
              <th className="min-w-17.5 border border-green-700 px-2 py-1.5 text-center">
                {t("reports.supply_status.table.headers.supply_percent")}
              </th>
              <th className="min-w-22.5 border border-green-700 px-2 py-1.5 text-right">
                {t("reports.supply_status.table.headers.total_demand")}
              </th>
              <th className="min-w-22.5 border border-green-700 px-2 py-1.5 text-right">
                {t("reports.supply_status.table.headers.total_supply")}
              </th>
              <th className="min-w-17.5 border border-green-700 px-2 py-1.5 text-center">
                {t("reports.supply_status.table.headers.supply_percent")}
              </th>
            </tr>
          </thead>

          {/* ── Body — grouped with rowSpan ──────────────────────────── */}
          <tbody>
            {groups.map((group) => {
              const isGrand = isGrandTotalRow(group.rows[0]);
              const rowSpanCount = group.rows.length;

              return group.rows.map((row, rowIdx) => {
                const isFirst = rowIdx === 0;
                const isTotal = isSubtotalRow(row);

                const baseBg = isGrand
                  ? "bg-green-800 text-white font-bold"
                  : isTotal
                    ? "bg-green-50 text-green-900 font-semibold"
                    : rowIdx % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50/60";

                const stickyBg = isGrand ? "bg-green-800" : "bg-white";

                const border = isGrand
                  ? "border border-green-700"
                  : isTotal
                    ? "border border-green-200"
                    : "border border-gray-100";

                const depotBorder = isGrand
                  ? "border border-green-700"
                  : "border border-gray-200";

                const hover = isGrand
                  ? ""
                  : "hover:bg-emerald-50/40 transition-colors duration-100";

                return (
                  <tr
                    key={`${row.depotName}-${row.districtName}-${rowIdx}`}
                    className={`${baseBg} ${hover}`}
                  >
                    {/* Merged cells — only rendered on the first row of each depot group */}
                    {isFirst && (
                      <>
                        <td
                          rowSpan={rowSpanCount}
                          className={`${depotBorder} sticky left-0 z-10 px-2 py-1.5 text-center align-middle font-semibold ${stickyBg}`}
                        >
                          {row.srNo > 0 ? row.srNo : ""}
                        </td>
                        <td
                          rowSpan={rowSpanCount}
                          className={`${depotBorder} sticky left-10 z-10 px-3 py-1.5 align-middle font-bold ${stickyBg}`}
                        >
                          {row.depotName}
                        </td>
                        <td
                          rowSpan={rowSpanCount}
                          className={`${depotBorder} px-3 py-1.5 text-right align-middle tabular-nums`}
                        >
                          {Number(row.generalSale) > 0
                            ? fmt(row.generalSale)
                            : "—"}
                        </td>
                      </>
                    )}

                    {/* District + data columns — every row */}
                    <td
                      className={`${border} px-3 py-1.5 ${isTotal ? "font-semibold italic" : ""}`}
                    >
                      {row.districtName}
                    </td>
                    <td
                      className={`${border} px-2 py-1.5 text-right tabular-nums`}
                    >
                      {fmt(row.class1To8Demand)}
                    </td>
                    <td
                      className={`${border} px-2 py-1.5 text-right tabular-nums`}
                    >
                      {fmt(row.class1To8Supply)}
                    </td>
                    <td
                      className={`${border} px-2 py-1.5 text-center tabular-nums ${supplyPctClass(row.class1To8SupplyPercent, isGrand)}`}
                    >
                      {fmtPct(row.class1To8SupplyPercent)}
                    </td>
                    <td
                      className={`${border} px-2 py-1.5 text-right tabular-nums`}
                    >
                      {fmt(row.class9To12Demand)}
                    </td>
                    <td
                      className={`${border} px-2 py-1.5 text-right tabular-nums`}
                    >
                      {fmt(row.class9To12Supply)}
                    </td>
                    <td
                      className={`${border} px-2 py-1.5 text-center tabular-nums ${supplyPctClass(row.class9To12SupplyPercent, isGrand)}`}
                    >
                      {fmtPct(row.class9To12SupplyPercent)}
                    </td>
                    <td
                      className={`${border} px-2 py-1.5 text-right tabular-nums`}
                    >
                      {fmt(row.totalDemand)}
                    </td>
                    <td
                      className={`${border} px-2 py-1.5 text-right tabular-nums`}
                    >
                      {fmt(row.totalSupply)}
                    </td>
                    <td
                      className={`${border} px-2 py-1.5 text-center tabular-nums ${supplyPctClass(row.totalSupplyPercent, isGrand)}`}
                    >
                      {fmtPct(row.totalSupplyPercent)}
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>

      {/* Footer legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-gray-50 px-4 py-2.5">
        <p className="text-[10px] text-gray-400">
          {t("reports.supply_status.table.footer.source")} &nbsp;|&nbsp;{" "}
          {t("reports.supply_status.table.footer.session")} &nbsp;|&nbsp;{" "}
          {t("reports.supply_status.table.footer.date")}
        </p>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-600" />
            <span className="text-gray-500">
              {t("reports.supply_status.table.footer.supply_100")}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-amber-500" />
            <span className="text-gray-500">
              {t("reports.supply_status.table.footer.supply_90_99")}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-500" />
            <span className="text-gray-500">
              {t("reports.supply_status.table.footer.supply_below_90")}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
