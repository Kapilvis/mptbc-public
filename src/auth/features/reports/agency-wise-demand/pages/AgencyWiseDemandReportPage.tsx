import { useState } from "react";
import { usePageTitle } from "shared/hooks/usePageTitle";
import { DropDownList, TextBox } from "shared/components/forms";
import { Card, GridPanel, Mosaic } from "shared/components/panels";
import Page from "shared/components/panels/Page";
import { useAgencyDemandReportQuery } from "../queries";

type TierType = "class1to4" | "class5to8" | "class9to12";

export default function AgencyWiseDemandReportPage() {
  const pageTitle = usePageTitle();
  const [activeTier, setActiveTier] = useState<TierType>("class1to4");
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [depotName, setDepotName] = useState("All");
  const [search, setSearch] = useState("");

  const { data = [], isLoading } = useAgencyDemandReportQuery({
    academicYear,
    depotName,
    search,
    tier: activeTier,
  });

  const academicYearOptions = [
    { label: "2026-2027", value: "2026-2027" },
    { label: "2025-2026", value: "2025-2026" },
  ];

  const depotOptions = [
    { label: "All Depots", value: "All" },
    { label: "INDORE", value: "INDORE" },
    { label: "UJJAIN", value: "UJJAIN" },
    { label: "KHANDWA", value: "KHANDWA" },
    { label: "BHOPAL", value: "BHOPAL" },
    { label: "JABALPUR", value: "JABALPUR" },
    { label: "GWALIOR", value: "GWALIOR" },
    { label: "SAGAR", value: "SAGAR" },
    { label: "REWA", value: "REWA" },
  ];

  return (
    <Page
      header={pageTitle || "Department Wise Demand & Supply Report"}
      subHeader="Depot-wise demand vs supply tracking for RSK (Class 1-8) and CPI (Class 9-12)."
      showHeaderActions
    >
      {/* Top Filter Card */}
      <Card className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <DropDownList
              label="Academic Year"
              data={academicYearOptions}
              value={academicYear}
              onChange={(val) => setAcademicYear(String(val ?? "2026-2027"))}
              textField="label"
              optionValue="value"
            />
          </div>

          <div>
            <DropDownList
              label="Depot Name"
              data={depotOptions}
              value={depotName}
              onChange={(val) => setDepotName(String(val ?? "All"))}
              textField="label"
              optionValue="value"
            />
          </div>

          <div className="md:col-span-2">
            <TextBox
              label="Search District / Depot"
              value={search}
              onChange={(val) => setSearch(String(val ?? ""))}
              placeholder="Search district or depot name..."
              icon="search"
              iconPosition="right"
            />
          </div>
        </div>
      </Card>

      {/* Multi-Tab Navigation (English Labels) */}
      <div className="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTier("class1to4")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTier === "class1to4"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <i className="pi pi-book" />
          <span>Class 1 to 4 (RSK)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
            Primary
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTier("class5to8")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTier === "class5to8"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <i className="pi pi-book" />
          <span>Class 5 to 8 (RSK)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
            Middle
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTier("class9to12")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTier === "class9to12"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <i className="pi pi-building" />
          <span>Class 9 to 12 (CPI)</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
            High School
          </span>
        </button>
      </div>

      {/* Scoped Row Highlighting Style matching DepotWiseDistrictTextbookSupplyStatusTable */}
      <style>{`
        .agency-demand-report-table tr:has(.depot-total-flag) {
          background-color: #f0fdf4 !important;
        }
        .dark .agency-demand-report-table tr:has(.depot-total-flag) {
          background-color: rgba(6, 78, 59, 0.45) !important;
        }
      `}</style>

      {/* Grid Table Section */}
      <Card className="agency-demand-report-table">
        <GridPanel
          toolbarPlacement="panel"
          defaultMode="grid"
          data={data}
          loading={isLoading}
          searchBox={false}
          showExport
          exportFilename={`Agency_Demand_Report_${activeTier}_${academicYear}`}
          columns={[
            {
              field: "depotSNo",
              header: "Depot S.No",
              align: "center",
              width: "90px",
              cell: (
                row: Reports.AgencyDemandReportItem,
                options?: { rowIndex: number },
              ) => {
                const rowIndex = options?.rowIndex ?? data.indexOf(row);
                const isFirstInGroup =
                  rowIndex === 0 ||
                  data[rowIndex - 1]?.depotName !== row.depotName;
                if (!isFirstInGroup) return null;
                return (
                  <span
                    className={
                      row.isDepotTotal
                        ? "font-bold text-green-900 dark:text-emerald-300"
                        : "font-semibold text-gray-800 dark:text-gray-200"
                    }
                  >
                    {row.depotSNo}
                  </span>
                );
              },
            },
            {
              field: "depotName",
              header: "Depot Name",
              cell: (
                row: Reports.AgencyDemandReportItem,
                options?: { rowIndex: number },
              ) => {
                const rowIndex = options?.rowIndex ?? data.indexOf(row);
                const isFirstInGroup =
                  rowIndex === 0 ||
                  data[rowIndex - 1]?.depotName !== row.depotName;
                if (!isFirstInGroup) return null;
                return (
                  <span
                    className={
                      row.isDepotTotal
                        ? "font-extrabold text-green-900 dark:text-emerald-300"
                        : "font-bold text-gray-900 dark:text-white"
                    }
                  >
                    {row.depotName}
                  </span>
                );
              },
            },
            {
              field: "districtName",
              header: "District Name",
              cell: (row: Reports.AgencyDemandReportItem) => (
                <span
                  className={
                    row.isDepotTotal
                      ? "depot-total-flag font-semibold italic text-green-900 dark:text-emerald-300"
                      : "text-gray-800 dark:text-gray-200 font-medium"
                  }
                >
                  {row.districtName}
                </span>
              ),
            },
            {
              field: "demand",
              header: "Demand (No. of books)",
              align: "right",
              cell: (row: Reports.AgencyDemandReportItem) => (
                <span
                  className={
                    row.isDepotTotal
                      ? "font-extrabold text-green-900 dark:text-emerald-300 font-mono"
                      : "font-bold text-gray-900 dark:text-white font-mono"
                  }
                >
                  {row.demand.toLocaleString()}
                </span>
              ),
            },
            {
              field: "supply",
              header: "Supply (No. of books)",
              align: "right",
              cell: (row: Reports.AgencyDemandReportItem) => (
                <span
                  className={
                    row.isDepotTotal
                      ? "font-extrabold text-green-900 dark:text-emerald-300 font-mono"
                      : "font-bold text-emerald-700 dark:text-emerald-400 font-mono"
                  }
                >
                  {row.supply.toLocaleString()}
                </span>
              ),
            },
            {
              field: "supplyPercent",
              header: "Distt. Wise Supply %",
              align: "right",
              cell: (row: Reports.AgencyDemandReportItem) => (
                <span
                  className={
                    row.isDepotTotal
                      ? "font-extrabold text-green-900 dark:text-emerald-300 font-mono"
                      : `font-bold ${
                          row.supplyPercent >= 90
                            ? "text-emerald-600"
                            : row.supplyPercent >= 60
                              ? "text-amber-600"
                              : "text-rose-600"
                        }`
                  }
                >
                  {row.supplyPercent.toFixed(2)}%
                </span>
              ),
            },
          ]}
          renderContent={(item: Reports.AgencyDemandReportItem) => (
            <Mosaic.Card
              title={`${item.depotName} - ${item.districtName}`}
              subTitle={[
                `Depot S.No: ${item.depotSNo}`,
                `Demand: ${item.demand.toLocaleString()} Books`,
                `Supply: ${item.supply.toLocaleString()} Books (${item.supplyPercent}%)`,
              ]}
              isActive={!item.isDepotTotal}
            />
          )}
        />
      </Card>
    </Page>
  );
}
