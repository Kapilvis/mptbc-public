import { useState, useMemo } from "react";
import Page from "shared/components/panels/Page";
import { Card, GridPanel } from "shared/components/panels";
import { DropDownList } from "shared/components/forms";
import AcademicYearFilterBar from "shared/components/filters/AcademicYearFilterBar";
import { usePageTitle } from "shared/hooks/usePageTitle";
import {
  DEPOT_DEMAND_DISTRIBUTION_DATA,
  OVERALL_TOTALS,
} from "../data/depotDemandDistributionData";
import type { DepotDemandDistributionItem } from "../data/depotDemandDistributionData";
import { DepotSummaryKpiCards } from "../components/DepotSummaryKpiCards";
import { DepotGroupSummaryCards } from "../components/DepotGroupSummaryCards";
import { DepotDetailDrawer } from "../components/DepotDetailDrawer";
import { Building2 } from "lucide-react";

const GROUP_FILTER_OPTIONS = [
  { label: "All Depot Supply Groups", value: "All" },
  { label: "Group A (Indore, Ujjain, Khandwa)", value: "A" },
  { label: "Group B (Bhopal, Jabalpur)", value: "B" },
  { label: "Group C (Gwalior, Sagar)", value: "C" },
  { label: "Group D (Rewa)", value: "D" },
];

export default function DepotDemandDistributionPage() {
  const pageTitle = usePageTitle();
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedDepot, setSelectedDepot] =
    useState<DepotDemandDistributionItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filtered Depots data
  const filteredData = useMemo(() => {
    if (selectedGroup === "All") {
      return DEPOT_DEMAND_DISTRIBUTION_DATA;
    }
    return DEPOT_DEMAND_DISTRIBUTION_DATA.filter(
      (item) => item.groupCategory === selectedGroup,
    );
  }, [selectedGroup]);

  // Dynamic calculated totals based on current filtered data
  const totals = useMemo(() => {
    if (selectedGroup === "All") {
      return OVERALL_TOTALS;
    }
    const totalDemand = filteredData.reduce((sum, d) => sum + d.totalDemand, 0);
    const approvedDemand = filteredData.reduce(
      (sum, d) => sum + d.approvedDemand,
      0,
    );
    const openingStock = filteredData.reduce(
      (sum, d) => sum + d.openingStock,
      0,
    );
    const actualDemandForWorkAllocation = filteredData.reduce(
      (sum, d) => sum + d.actualDemandForWorkAllocation,
      0,
    );
    const workAllocatedToPrinter = filteredData.reduce(
      (sum, d) => sum + d.workAllocatedToPrinter,
      0,
    );
    const deliveryInDepot = filteredData.reduce(
      (sum, d) => sum + d.deliveryInDepot,
      0,
    );
    const dispatchToBlock = filteredData.reduce(
      (sum, d) => sum + d.dispatchToBlock,
      0,
    );
    const currentDepotStock = filteredData.reduce(
      (sum, d) => sum + d.currentDepotStock,
      0,
    );
    const deliveryPercent =
      workAllocatedToPrinter > 0
        ? Number(((deliveryInDepot / workAllocatedToPrinter) * 100).toFixed(1))
        : 0;
    const dispatchPercent =
      approvedDemand > 0
        ? Number(((dispatchToBlock / approvedDemand) * 100).toFixed(1))
        : 0;

    return {
      totalDemand,
      approvedDemand,
      openingStock,
      actualDemandForWorkAllocation,
      workAllocatedToPrinter,
      deliveryInDepot,
      dispatchToBlock,
      currentDepotStock,
      printerPendingDelivery: workAllocatedToPrinter - deliveryInDepot,
      blockPendingDispatch: approvedDemand - dispatchToBlock,
      deliveryPercent,
      dispatchPercent,
      totalDepots: filteredData.length,
    };
  }, [filteredData, selectedGroup]);

  const handleOpenDepot = (depot: DepotDemandDistributionItem) => {
    setSelectedDepot(depot);
    setIsDrawerOpen(true);
  };

  return (
    <Page
      header={pageTitle || "Depot Demand Distribution"}
      subHeader="Depot-wise demand tracking, opening stock deduction, printer work allocation, depot deliveries, and block dispatch progress for Academic Year 2026-2027."
      showHeaderActions
    >
      {/* 1. Academic Year Filter Bar */}
      <AcademicYearFilterBar
        academicYear={academicYear}
        onChange={setAcademicYear}
        title="Session Filter"
        subtitle={`Viewing Depot Demand Distribution and Work Allocation for Session ${academicYear}.`}
      />

      {/* 2. Top Summary KPI Cards (Total Demand 450K, Approved 390K, Opening Stock 30.5K, Printer Allocation 359.5K, Delivery in Depot 258K, Block Dispatch 150K) */}
      <DepotSummaryKpiCards totals={totals} />

      {/* 3. Group A, B, C, D Category Cards from Image 2 */}
      <DepotGroupSummaryCards
        selectedGroup={selectedGroup}
        onSelectGroup={setSelectedGroup}
      />

      {/* 4. Main Primary Data Table with All Handwritten Columns from Image 1 */}
      <Card className="border border-slate-200/90 dark:border-slate-800 shadow-2xs">
        {/* Table Filter / Actions Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2
                size={18}
                className="text-blue-600 dark:text-blue-400"
              />
              Depot - Demand - Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Depot Wise Demand, Work Allocation & Distribution Status
            </p>
          </div>

          <div className="w-full sm:w-72">
            <DropDownList
              label="Depot Group Filter"
              data={GROUP_FILTER_OPTIONS}
              value={selectedGroup}
              onChange={(val) => setSelectedGroup(String(val ?? "All"))}
              textField="label"
              optionValue="value"
            />
          </div>
        </div>

        <GridPanel
          toolbarPlacement="panel"
          defaultMode="grid"
          data={filteredData}
          showExport
          exportFilename={`Depot_Demand_Distribution_${academicYear}.xls`}
          searchBox={true}
          searchPlaceholder="Search Depot Name, Code, Group..."
          searchFields={[
            "depotName",
            "depotCode",
            "groupCategory",
            "groupDescription",
          ]}
          columns={[
            {
              header: "#",
              cell: (_, option) => (
                <span className="text-slate-400 font-semibold text-xs">
                  {option.rowIndex + 1}
                </span>
              ),
              width: "48px",
              align: "center",
              footer: (
                <span className="font-black text-slate-900 dark:text-white text-xs block text-center">
                  Total
                </span>
              ),
            },
            {
              field: "depotName",
              header: "DEPOT NAME",
              width: "160px",
              cell: (row: DepotDemandDistributionItem) => (
                <div
                  className="cursor-pointer group"
                  onClick={() => handleOpenDepot(row)}
                >
                  <span className="font-black text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 block text-xs transition-colors">
                    {row.depotName}
                  </span>
                  <span className="text-[10.5px] text-slate-500 dark:text-slate-400">
                    {row.depotCode}
                  </span>
                </div>
              ),
              footer: (
                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                  {filteredData.length} Depots
                </span>
              ),
            },
            {
              field: "groupCategory",
              header: "GROUP",
              width: "90px",
              align: "center",
              cell: (row: DepotDemandDistributionItem) => {
                const badgeColor =
                  row.groupCategory === "A"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : row.groupCategory === "B"
                      ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300"
                      : row.groupCategory === "C"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300"
                        : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";

                return (
                  <span
                    className={`text-[10.5px] font-black px-2 py-0.5 rounded-md border ${badgeColor}`}
                  >
                    Group {row.groupCategory}
                  </span>
                );
              },
            },
            {
              field: "totalDemand",
              header: "TOTAL DEMAND",
              align: "right",
              width: "120px",
              cell: (row: DepotDemandDistributionItem) => (
                <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                  {row.totalDemand.toLocaleString()}
                </span>
              ),
              footer: (
                <span className="font-black text-slate-900 dark:text-white text-xs block text-right pr-2">
                  {totals.totalDemand.toLocaleString()}
                </span>
              ),
            },
            {
              field: "approvedDemand",
              header: "APPROVED DEMAND",
              align: "right",
              width: "140px",
              cell: (row: DepotDemandDistributionItem) => (
                <span className="font-black text-indigo-700 dark:text-indigo-400 text-xs">
                  {row.approvedDemand.toLocaleString()}
                </span>
              ),
              footer: (
                <span className="font-black text-indigo-700 dark:text-indigo-400 text-xs block text-right pr-2">
                  {totals.approvedDemand.toLocaleString()}
                </span>
              ),
            },
            {
              field: "openingStock",
              header: "OPENING STOCK",
              align: "right",
              width: "120px",
              cell: (row: DepotDemandDistributionItem) => (
                <span className="font-semibold text-amber-700 dark:text-amber-400 text-xs">
                  {row.openingStock.toLocaleString()}
                </span>
              ),
              footer: (
                <span className="font-black text-amber-700 dark:text-amber-400 text-xs block text-right pr-2">
                  {totals.openingStock.toLocaleString()}
                </span>
              ),
            },
            {
              field: "workAllocatedToPrinter",
              header: "ACTUAL DEMAND (WORK ALLOCATION)",
              align: "right",
              width: "180px",
              cell: (row: DepotDemandDistributionItem) => (
                <div>
                  <span className="font-black text-purple-700 dark:text-purple-400 text-xs block">
                    {row.workAllocatedToPrinter.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    ({row.approvedDemand.toLocaleString()} −{" "}
                    {row.openingStock.toLocaleString()})
                  </span>
                </div>
              ),
              footer: (
                <span className="font-black text-purple-700 dark:text-purple-400 text-xs block text-right pr-2">
                  {totals.workAllocatedToPrinter.toLocaleString()}
                </span>
              ),
            },
            {
              field: "deliveryInDepot",
              header: "DELIVERY IN DEPOT",
              align: "right",
              width: "140px",
              cell: (row: DepotDemandDistributionItem) => (
                <div>
                  <span className="font-black text-emerald-700 dark:text-emerald-400 text-xs block">
                    {row.deliveryInDepot.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {row.deliveryPercent}% Recv
                  </span>
                </div>
              ),
              footer: (
                <div>
                  <span className="font-black text-emerald-700 dark:text-emerald-400 text-xs block text-right pr-2">
                    {totals.deliveryInDepot.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 block text-right pr-2">
                    ({totals.deliveryPercent}% Total)
                  </span>
                </div>
              ),
            },
            {
              field: "dispatchToBlock",
              header: "DISPATCH TO BLOCK",
              align: "right",
              width: "140px",
              cell: (row: DepotDemandDistributionItem) => (
                <div>
                  <span className="font-black text-teal-700 dark:text-teal-400 text-xs block">
                    {row.dispatchToBlock.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">
                    {row.dispatchPercent}% of Appr
                  </span>
                </div>
              ),
              footer: (
                <div>
                  <span className="font-black text-teal-700 dark:text-teal-400 text-xs block text-right pr-2">
                    {totals.dispatchToBlock.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-teal-600 block text-right pr-2">
                    ({totals.dispatchPercent}% Total)
                  </span>
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* 6. Drilldown Detail Drawer */}
      <DepotDetailDrawer
        depot={selectedDepot}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </Page>
  );
}
